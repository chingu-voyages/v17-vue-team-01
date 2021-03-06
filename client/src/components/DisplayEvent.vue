<template>
  <v-container>
  <v-card class="pa-2">
    <v-sheet v-if="eventPart">
      <h2 class="mb-5">{{ eventPart.title }}</h2>
      <h4 class="mb-2">Details:</h4>
      <p class="mb-5">{{ eventPart.details }}</p>
      <div v-if="!eventPart.scheduled">
        <div v-if="typeof advisableTimeslots != 'string'" >
        <p class="mb-5">The following timeslots have already been selected by all the participants:</p>
        <p>{{ advisableTimeslots.map(tsml => tsml.slice(0, -5)+ " " +(tsml.slice(-5, -2)) + "00").join(", ") }} </p>
        <p>One timeslot has already been added to schedule an event.</p>
        </div>
        <div v-else class="mb-5">
          <p class="mb-5"> {{advisableTimeslots}} </p>
        </div>
      </div>      
      <h4>Users:</h4>
      <v-list :shaped ="shaped">
      <div>
        <span class="mr-8 mb-8" :inactive="inactive" v-for="(participants, i) in eventPart.users" :key="i">
          {{ participants.username }} <span v-if="participants.username == user.username"> (You) </span>
        </span>
      </div>
      </v-list>
      <div v-if="eventPart.scheduled">
        <h4 class="mt-5">The event has already been scheduled!</h4>
      </div>  
      <div v-else>
      <h4 class="mt-5">Current Event Calendar:</h4>
      <br>
      <v-card-actions v-if="!eventPart.scheduled" class="justify-center topNegativeMargin">
        <v-btn @click="createTimeslots(user)" class="center" color="success">Change timeslots</v-btn>
      </v-card-actions>
      <br>
        <v-row align="center" justify="center" no-gutters>
          <template v-for="(day, i) in possible=computePossibleDays(eventPart.users, user.username, eventPart.possibleDays, user.TZ)">
            <v-col :key="`day-${i}`">
              <v-card class="mx-auto" max-width="110" :value="day">
                <h3 class="timeslotName">
                  {{
                  computedDay(day)
                  }}
                </h3>
                <h4 class="timeslotName">
                  {{
                  computedDayWeek(day)
                  }}
                </h4>  
                <v-col>
                  <template v-for="n in 24">
                    <label
                      class="checkbox-label"
                      :key="`checkbox-label-${i}-${n}`"
                      :for="`checkbox-${i}-${n}`"
                    >
                      <input
                        :key="`checkbox-${i}-${n}`"
                        type="checkbox"
                        :id="`checkbox-${i}-${n}`"
                        :value="n-1"
                        class="checkbox"
                        :checked="computedChecked(day, n-1, user._id)"
                        :disabled="computedDisabled(eventPart, user, i, n, possible)"           
                      >
                      <span class="numbering">{{numbering(n-1)}}:00</span>
                      <span class="checkmark"></span>
                    </label>
                    <span :key="`tooltip-label-${i}-${n}`">
                      <v-tooltip bottom :disabled="computedUserNames(day, n-1, eventPart.users) == null">
                        <template #activator="data">
                          <div v-on="data.on" class="rounded text-center" :style="{ background: computedClass(day, n-1, eventPart.color, eventPart.users.length ) }">
                            {{computedUsers(day, n-1 )}}
                          </div>
                        </template>
                        <span><template v-for="(i,index) in computedUserNames(day, n-1, eventPart.users)">{{index+1}}: {{ i == user.username ? i + " (You)" : i}} </template></span>
                      </v-tooltip>
                      <br>
                    </span>
                  </template>
                </v-col>
              </v-card>
              <br>
            </v-col>
          </template>
        </v-row>
            <v-card-actions v-if="!eventPart.scheduled" class="justify-center topNegativeMargin" >
              <v-btn @click="createTimeslots(user)" class="center" color="success">Change timeslots</v-btn>
            </v-card-actions>
      </div>      
    </v-sheet>  
  </v-card>
  </v-container>
</template>

<script>
export default {
  name: "DisplayEvent",
  props: {
    eventPart: Object,
    timeslotPart: Array,
    advisableTimeslots: Array,
    url: String
  },
  components: {},
  data () {
    return {
      slotItems: [],  
      possible: []
    }
  },
  methods: {
  pSBC: function(p,c0,c1,l){
	let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
	if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
	if(!this.pSBCr)this.pSBCr=(d)=>{
		let n=d.length,x={};
		if(n>9){
			[r,g,b,a]=d=d.split(","),n=d.length;
			if(n<3||n>4)return null;
			x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
		}else{
			if(n==8||n==6||n<4)return null;
			if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
			d=i(d.slice(1),16);
			if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
			else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
		}return x};
	h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
	if(!f||!t)return null;
	if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
	else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
	a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
	if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
	else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
},
    numbering(n) {
      if (n < 10) {
        return `0${n}`;
      }
      return n;
    },
    computedDay(day){
      const m = new Date(day);
      const month = new Array();
      month[0] = "January";
      month[1] = "February";
      month[2] = "March";
      month[3] = "April";
      month[4] = "May";
      month[5] = "June";
      month[6] = "July";
      month[7] = "August";
      month[8] = "September";
      month[9] = "October";
      month[10] = "November";
      month[11] = "December";
      return m.getDate() + " " + month[m.getMonth()];
    },
    computedDayWeek(day){
      const d = new Date(day);
      const weekday = new Array(7);
      weekday[0] = "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";
      return weekday[d.getDay()];
    },
    computedClass(i, n, c, numberUsers) {
      const colorBase = this.pSBC(0.9,c,false,true);
      let nUsers = (0.9/numberUsers);
      let count = 0;
      this.changeToUserTZ.forEach(function (tmsl){ 
        if(i == tmsl.day && n == tmsl.time){
          count++;
        }
      })
      if(count != 0){
        let color = this.pSBC(0.9-(nUsers*count),c,false,true);
        return color;
      }
      else{
        return colorBase;
      }
    },
    computedChecked(i, n, userId) {
      let checked;
      this.changeToUserTZ.forEach(function (tmsl){ 
        if(i == tmsl.day && n == tmsl.time && userId == tmsl.user){
          checked = true;
        }
      })
      return checked;
    },
    computedDisabled(eventPart, user, i, n, possible) {
      let disabled;
      let diffFromCreator = user.TZ-eventPart.users[0].TZ;
      if(eventPart.scheduled == true) {
        disabled = true;
        return disabled;
      }
      if(eventPart.users[0].username != user.username && diffFromCreator > 0 ){
        //GMT 0 creator, GMT 8 user
        if(i == 0 && n < user.TZ-eventPart.users[0].TZ+1){
          disabled = true;
          return disabled;
        }
        if(i == possible.length-1 && n > user.TZ-eventPart.users[0].TZ){
          disabled = true;
          return disabled;
        }
      }
      if(eventPart.users[0].username != user.username && diffFromCreator < 0 ){
        //GMT 0 creator, GMT -8 user
        if(i == 0 && n < 24+user.TZ-eventPart.users[0].TZ+1){
          disabled = true;
          return disabled;
        }
        if(i == possible.length-1 && n > 24+user.TZ-eventPart.users[0].TZ){
          disabled = true;
          return disabled;
        }
      }
    },
    computedUsers(i, n) {
      let countU = 0;
      this.changeToUserTZ.forEach(function (tmsl){ 
        if(i == tmsl.day && n == tmsl.time)countU++;
      })
      return countU;
    },
    computedUserNames(i, n, eventPartUsers) {
      let usernames = [];
      this.changeToUserTZ.forEach(function (tmsl){ 
        if(i == tmsl.day && n == tmsl.time){
          eventPartUsers.forEach(function (user){
            if(tmsl.user == user._id) usernames.push(user.username);  
          })  
        }
      })
      if(usernames.length == 0) return null;
      return usernames;
    },
    createTimeslots(user){
      let sizePossibleDays = this.eventPart.possibleDays.length;
      let creator = this.eventPart.users[0];
      let possibleDaysArray = [];
      if(creator.username == user.username || user.TZ == creator.TZ) {
        sizePossibleDays = this.eventPart.possibleDays.length;
        possibleDaysArray = this.eventPart.possibleDays;
      }
      else{
        //calculate new possibleDaysArray
        sizePossibleDays = this.eventPart.possibleDays.length + 1;
        possibleDaysArray = this.computePossibleDays(this.eventPart.users, user.username, this.eventPart.possibleDays, user.TZ);
      }
      let confirmation = confirm("Are you sure you want to add timeslots? Previous created timeslots will be replaced!");
      if (confirmation == true) {
      for(let i = 0; i < sizePossibleDays; i++){
        for(let n = 1; n < 25; n++){
          let myId = "checkbox-"+i+"-"+n;
          let day;
          //console.log(document.getElementById(myId));
          if(document.getElementById(myId).checked){
            day = possibleDaysArray[i]; 
            this.slotItems.push([day, n-1]);
          }
        }
      }
        const data = {
          event_id: this.url,
          timeslots: this.slotItems
        };
        //console.log(this.slotItems);
        let route;
        process.env.VUE_APP_BE_URL ? route = process.env.VUE_APP_BE_URL + "timeslots/create" : route = "https://chingutime.herokuapp.com/api/timeslots/create";        
        this.axios
          .post(route, data, {
          //.post(process.env.VUE_APP_BE_URL + "timeslots/create", data, {
            headers: {
              "x-access-token": localStorage
                .getItem("usertoken")
                .replace(/"/g, "")
            }
          })
          .then(
            response => (
              //this.answer
              location.reload()
            )
          )
          .catch(error => (console.log(error), (this.answer = error)));
      }
    },

    computePossibleDays(users, username, possibleDays, TZ){
      let possibles = [];
      let size = possibleDays.length;
      let creator = users[0];
      if(username == creator.username || TZ == creator.TZ){
        return possibleDays;
      }
      else{
        this.calculatePossibleDays.forEach(function (possible, i){ 
          possibles.push(possible);
          if(creator.TZ >= 0 && TZ >= 0){
            if (i+1 == size && creator.TZ < TZ){ 
              let day = new Date(possible);
              let newDate = new Date(day.setTime( day.getTime() + 1 * 86400000 ));
              possible = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2);
              possibles.push(possible);
            }
            if (i == 0 && creator.TZ > TZ){ 
              let day = new Date(possible);
              let newDate = new Date(day.setTime( day.getTime() - 1 * 86400000 ));
              possible = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2);
              possibles.unshift(possible);
            }
          }
          if(creator.TZ < 0 && TZ < 0){
            if (i+1 == size && Math.abs(creator.TZ) > Math.abs(TZ)){ 
              let day = new Date(possible);
              let newDate = new Date(day.setTime( day.getTime() + 1 * 86400000 ));
              possible = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2);
              possibles.push(possible);
            }
            if (i == 0 && Math.abs(creator.TZ) < Math.abs(TZ)){ 
              let day = new Date(possible);
              let newDate = new Date(day.setTime( day.getTime() - 1 * 86400000 ));
              possible = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2);
              possibles.unshift(possible);
            }
          }
          if(creator.TZ >= 0 && TZ < 0 && i == 0){
            let day = new Date(possible);
            let newDate = new Date(day.setTime( day.getTime() - 1 * 86400000 ));
            possible = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2);
            possibles.unshift(possible);
          }
          if(creator.TZ < 0 && TZ >= 0&& i+1 == size){
            let day = new Date(possible);
            let newDate = new Date(day.setTime( day.getTime() + 1 * 86400000 ));
            possible = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2);
            possibles.push(possible);
          }
        })
      }
      //console.log(possibles)
      return possibles;
    },
  },
  
  computed: {
    calculatePossibleDays() {
      //console.log(eventPartUsers)
      return this.eventPart.possibleDays;
    },
    changeToUserTZ() {
      this.timeslotPart.forEach(timeslot => {
        timeslot.time = parseInt(timeslot.time) + parseInt(this.user.TZ);
        if(timeslot.time < 0){
          let dateDay = new Date(timeslot.day);
          let newDate = new Date(dateDay.setTime( dateDay.getTime() - 1 * 86400000 ));
          timeslot.day = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2); 
          timeslot.time = timeslot.time + 24;
        }
        if(timeslot.time > 23){
          let dateDay = new Date(timeslot.day);
          let newDate = new Date(dateDay.setTime( dateDay.getTime() + 1 * 86400000 ));
          timeslot.day = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + ("0" + (newDate.getDate())).slice(-2); 
          timeslot.time = timeslot.time - 24;
        }
      })
      return this.timeslotPart;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-input--selection-controls {
  margin-top: 0px;
  padding-top: 4px;
}
.v-messages {
  min-height: 0px;
}
.timeslotName {
  text-align: center;
  padding-top: 10px;
}
.input {
  color: black;
  display: block;
  border: 1px solid black;
  max-width: 600px;
  width: 290px;
  border-radius: 3px;
  padding: 10px 5px;
  margin: 0 auto 10px auto;
  font-size: 18px;
  &-long {
    width: 100%;
  }
}
.rounded {
  border: none;
  border-radius: 10px;
}
//-----------------------------------------

/* The checkbox-label */
.checkbox-label {
  display: block;
  position: relative;
  padding: 1px 0 0 30px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.checkbox-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  width: 24px;
  background-color: #eee;
}

/* Add a red background color for disable checkbox */
.checkbox-label input:disabled ~ .checkmark {
  background-color: #4d0202;
  cursor: default;
}
.checkbox-label:hover input:disabled ~ .checkmark {
  background-color: #4d0202;
  cursor: default;
}
.checkbox-label input:disabled ~ .numbering{
  cursor: default;
}

/* On mouse-over, add a grey background color */
.checkbox-label:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.checkbox-label input:checked ~ .checkmark {
  background-color: #2196f3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.checkbox-label input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.checkbox-label .checkmark:after {
  left: 9px;
  top: 6px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>