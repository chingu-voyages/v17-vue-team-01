<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card v-if="eventPart && advisableTimeslots" class="mx-auto" max-width="360">
            <h1 class="leftMargin">Event Actions</h1>
            <p class="leftMargin" v-if="user.username == eventPart.users[0].username"> You are the event creator </p>
            <span v-if="eventPart.scheduled == false">
            <v-divider></v-divider>
            <v-card-text>   
              <input
                class="input"
                v-on:keyup.enter="addUser"
                type="text"
                name="username"
                v-model="username"
                placeholder="Username"
              >
            </v-card-text>
            <v-card-actions class="justify-center topNegativeMargin">
              <v-btn @click="addUser" class="center" color="success">Add user</v-btn>
            </v-card-actions>
            <v-divider></v-divider>
            <v-card-text v-if="eventPart.users.length > 1">   
              <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="date"
              persistent
              width="290px"
            >
            <template v-slot:activator="{ on }">
              <input
                class="input"
                v-model="date"
                placeholder="Select date to schedule"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="date" @input="$refs.dialog.save(date); modal = false" :min="eventPart.possibleDays[0]" :max="eventPart.possibleDays[1]">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
              <!--<v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>-->
            </v-date-picker>
            </v-dialog>
       
        <v-menu
        ref="menu"
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <input
            class="input"
            placeholder="Select time to schedule"
            v-on="on"
            :value="time"
          />
        </template>
        <v-time-picker
          v-if="menu2"
          full-width
          format="24hr"
          :value="time"
          @click:hour="closePicker"
        ></v-time-picker>
      </v-menu>
        
      

          </v-card-text>
            <v-card-actions class="justify-center topNegativeMargin" v-if="eventPart.users.length > 1">
              <v-btn @click="schedule" class="center" color="primary">Schedule Event</v-btn>
            </v-card-actions>
            <v-divider></v-divider>
            <v-card-text v-if="user.username == eventPart.users[0].username && eventPart.users.length > 1"> 
                <select v-model="userDelete" class="input" placeholder="Users" label="Users">
                <option disabled value>Please select User</option>
                <option v-for="userDel in eventPart.users.slice(1)" :value="userDel.username" :key="userDel">{{userDel.username}}</option>
                </select>
            </v-card-text> 
            <v-card-actions class="justify-center topNegativeMargin" v-if="user.username == eventPart.users[0].username && eventPart.users.length > 1">
              <v-btn @click="removeUser" class="center" color="warning">Remove user</v-btn>
            </v-card-actions>
            </span>
            <span v-else>
              <p class="leftMargin"> This event {{eventPart.title}} is already scheduled! </p>
              <p class="leftMargin"> Its scheduled date and time is: {{eventPart.start}} </p>
            </span>  
            <v-divider></v-divider>
            <v-card-actions class="justify-center" v-if="eventPart.scheduled == true">
                <v-btn @click="downloadIcs" class="center" color="primary">Download ics</v-btn>
            </v-card-actions>
            <v-divider></v-divider>
            <v-card-actions class="justify-center" v-if="user.username == eventPart.users[0].username">
                <v-btn @click="deleteEvent" class="center" color="red darken-4">Delete Event</v-btn>
            </v-card-actions>
        </v-card>
        <br>
        <v-card class="mx-auto" max-width="360" v-if="answer">
          <v-card-text>
            <h3>{{ answer }}</h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ActionsEvent",
  props: {
    eventPart: Object,
    url: String,
    advisableTimeslots: Array,
  },
  data() {
    return {
      username: null,
      answer: null,
      userDelete: "",
      date: null,
      modal: false,
      time: null,
      menu2: false,
      numberHours: 1 //currently hardcoded to 1 as v-slider is not working
    };
  },
  computed() {},
  watch: {
    advisableTimeslots: function () {
      if(typeof this.advisableTimeslots != "string"){
        this.date = this.advisableTimeslots[0].substring(0, this.advisableTimeslots[0].indexOf('T'));
        this.time = parseInt(this.advisableTimeslots[0].substring(this.advisableTimeslots[0].indexOf('C'), this.advisableTimeslots[0].indexOf('T')+1))+this.user.TZ;
        if(this.time < 0){
          this.time += 24;
          let dateDay = new Date(this.date);
          let newDate = new Date(dateDay.setTime( dateDay.getTime() - 1 * 86400000 ));
          this.date = newDate.getFullYear() + '-' + ('0' + (newDate.getMonth()+1)).slice(-2) + '-' + (newDate.getDate());
        }
        if(this.time > 24){
          this.time -= 24;
          let dateDay = new Date(this.date);
          let newDate = new Date(dateDay.setTime( dateDay.getTime() + 1 * 86400000 ));
          this.date = newDate.getFullYear() + '-' + ('0' + (newDate.getMonth()+1)).slice(-2) + '-' + (newDate.getDate());
        }
        this.time += ":00"; 
      }
    }
  },
  methods: {
    toSnakeCase: str =>
    str &&
    str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.toLowerCase())
      .join('_'),

    closePicker: function(v){
      v = v < 10 ? '0'+v : v;
      
      this.time = v+":00";
      this.menu2 = false;
      //console.log(this.time);
      //return this.time;
      //$refs.menu.save(time)
    },

    addUser() {
      if (!this.user.username) {
        this.answer = "Please fill out a username.";
      } else {
          const data = {
            event_id: this.url,
            username: this.username
          };
        this.axios
          //.post("https://chingutime.herokuapp.com/api/events/add", data, {
            .post("http://localhost:5000/api/events/add", data, {
              headers: { "x-access-token": localStorage.getItem("usertoken").replace(/"/g, "") }
          })
          .then(response => this.handleResponse(response))
          .catch(error => (console.log(error), (this.answer = error)));
      }
    },
    
    removeUser() {
      console.log(this.userDelete);
      if (this.userDelete == "Please select a user to remove" || !this.userDelete) {
        this.answer = "Please select a user to remove.";
      } else {
          console.log(this.url);
          const data = {
            event_id: this.url,
            username: this.userDelete
          };
        this.axios
          //.post("https://chingutime.herokuapp.com/api/events/remove", data, {
            .post("http://localhost:5000/api/events/remove", data, {
              headers: { "x-access-token": localStorage.getItem("usertoken").replace(/"/g, "") }
          })
          .then(response => this.handleResponse(response))
          .catch(error => (console.log(error), (this.answer = error)));
      }
    },
    handleResponse(response) {
      if (response.data.success == true) {
        this.answer = response.data.msg.replace(this.url, this.eventPart.title);
        location.reload();
      } else {
        this.answer = response.data.msg;
      }
    },
    deleteEvent() {
      let confirmation = confirm("Are you sure you want to delete this event?");
      if (confirmation == true) {
        const data = {
        event_id: this.url,
        };
        this.axios
            //.post("https://chingutime.herokuapp.com/api/events/delete", data, {
              .post("http://localhost:5000/api/events/delete", data, {
                headers: { "x-access-token": localStorage.getItem("usertoken").replace(/"/g, "") }
            })
            .then(response => this.$router.push({ name: 'Home', params: { user: this.user } }))
            .catch(error => (console.log(error), (this.answer = error)));
      }
    },
    schedule() {
      //console.log(this.toSnakeCase(this.eventPart.title));
      if (!this.date || !this.time) {
        this.answer = "Please fill out all the fields to schedule the event.";
      } else {
      let confirmation = confirm("Are you sure you want to schedule this event?");
      if (confirmation == true) {
        let start = this.date + " " + this.time + ":00";
        let timeEnd = parseInt(this.time.replace(":00", "")) + this.numberHours;
        if(timeEnd > 24){
          timeEnd -= 24;
          let dateDay = new Date(this.date);
          let newDate = new Date(dateDay.setTime( dateDay.getTime() + 1 * 86400000 ));
          this.date = newDate.getFullYear() + '-' + ('0' + (newDate.getMonth()+1)).slice(-2) + '-' + (newDate.getDate());
        }
        let end = this.date + " " + timeEnd + ":00:00";
        const data = {
        event_id: this.url,
        scheduled: 'true',
        start: start, 
        end: end
        };
        this.axios
            //.post("https://chingutime.herokuapp.com/api/events/update", data, {
              .post("http://localhost:5000/api/events/update", data, {
                headers: {
                  "x-access-token": localStorage.getItem("usertoken").replace(/"/g, ""),
                  'Accept': 'application/octet-stream',
                },
                responseType: 'blob',
            })
            .then(response => {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'ChinguTime_'+this.toSnakeCase(this.eventPart.title)+'_'+this.date+'.ics');
              document.body.appendChild(link);
              link.click();
              this.answer = "Congrats, event "+this.eventPart.title+" is scheduled! Here you have you ics file.";
              this.$router.push({ name: 'Home', params: { user: this.user } })
            })
            .catch(error => (console.log(error), (this.answer = error)));
      }
      }
    },

    downloadIcs() {
      //still to be done, maybe a new route to BE?
    }
  }
};
</script>

<style lang="scss">
.leftMargin {
  margin-left: 15px;
}
.topNegativeMargin {
  margin-top: -15px;
}
.input {
  color: black;
  display: block;
  border: 1px solid black;
  width: 96%;

  border-radius: 3px;
  padding: 10px 5px;
  margin: 0 0 10px 0;
  font-size: 18px;
}
</style>