<template>
  <v-col>
    <v-card class="mx-auto" max-width="700" v-if="!eventFirstValidate">
      <v-card-text>
        <h1>Create a new Event!</h1>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field v-model="name" :rules="nameRules" label="Event name" required></v-text-field>

          <v-row justify="space-around">
            <v-col>
              <v-date-picker no-title v-model="dates" range></v-date-picker>
              <br>
              <v-text-field v-model="dateRangeText" label="Date range" readonly></v-text-field>
            </v-col>
            <v-color-picker
              hide-inputs
              hide-canvas
              v-model="color"
              class="ma-2"
              show-swatches
              swatches-max-height="230"
            ></v-color-picker>
          </v-row>

          <br>
          <v-row justify="center">
            <v-btn :disabled="!valid" color="success" class="mr-4" @click="processFormFirst">Save</v-btn>
            <v-btn color="error" class="mr-4" @click="reset">Reset Form</v-btn>
            <v-btn to="/" color="primary">Back Home</v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <br v-if="!eventFirstValidate">
    <v-card class="mx-auto" scrollable max-width="1200" v-if="eventFirstValidate">
      <v-card-text>
        <h1>Select the times</h1>
        <br>
        <v-form ref="form" v-model="valid" lazy-validation>
          <template>
            <v-row align="center" justify="center" no-gutters>
              <template v-for="(slot, i) in slots">
                <v-col :key="`slot-${i}`">
                  <v-card class="mx-auto" max-width="110" :value="slot">
                    <h2 class="timeslotName">
                      {{
                      createdEvent.eventDates[i][2] + " " + months[createdEvent.eventDates[i][1]].slice(0, 3)
                      }}
                    </h2>
                    <v-col>
                      <v-checkbox v-model="slotItems[i]" label="00:00" value="0"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="01:00" value="1"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="02:00" value="2"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="03:00" value="3"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="04:00" value="4"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="05:00" value="5"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="06:00" value="6"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="07:00" value="7"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="08:00" value="8"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="09:00" value="9"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="10:00" value="10"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="11:00" value="11"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="12:00" value="12"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="13:00" value="13"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="14:00" value="14"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="15:00" value="15"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="16:00" value="16"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="17:00" value="17"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="18:00" value="18"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="19:00" value="19"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="20:00" value="20"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="21:00" value="21"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="22:00" value="22"></v-checkbox>
                      <v-checkbox v-model="slotItems[i]" label="23:00" value="23"></v-checkbox>
                    </v-col>
                  </v-card>
                  <br>
                </v-col>
              </template>
            </v-row>
          </template>
          <br>
          <v-row justify="center">
            <v-btn :disabled="!valid" color="success" class="mr-4" @click="processFormSecond">Save</v-btn>
            <v-btn color="error" class="mr-4" @click="reset">Reset Form</v-btn>
            <v-btn to="/" color="primary">Back Home</v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto" max-width="400" v-if="answer">
      <v-card-text>
        <h3>{{ answer }}</h3>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    dates: [null, null],
    name: null,
    color: null,
    colorValue: null,
    answer: null,
    eventFirstValidate: false,
    slots: null,
    slotItems: [],
    createdEvent: {
      eventId: null,
      eventName: null,
      eventDates: null,
      eventStart: null,
      eventEnd: null,
      eventColor: null,
      eventTimeslots: {}
    },
    months: [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    nameRules: [v => !!v || "Name is required"]
  }),
  computed: {
    dateRangeText() {
      if (this.dates) {
        return this.dates.join(" ~ ");
      }
    }
  },
  mounted() {
    this.color = "#3f51b5";
  },
  methods: {
    reset() {
      this.$refs.form.reset();
    },
    processFormFirst() {
      if (
        !this.name ||
        !this.color ||
        this.dates[0] == null ||
        this.dates[1] == null
      ) {
        this.answer = "Please fill out all the fields.";
        window.scrollBy(0, 200);
        return;
      }
      let dateSplit1 = this.dates[0].split("-");
      let dateSplit2 = this.dates[1].split("-");
      let d1 = new Date(
        Number(dateSplit1[0]),
        Number(dateSplit1[1]) - 1,
        Number(dateSplit1[2])
      );
      let d2 = new Date(
        Number(dateSplit2[0]),
        Number(dateSplit2[1]) - 1,
        Number(dateSplit2[2])
      );

      if (d1.getTime() > d2.getTime()) {
        this.answer = "Please select the range with the earlier date first";
        window.scrollBy(0, 200);
      } else if (this.dateNames(d1, d2).length > 10) {
        this.answer = "Currently only a range of 10 dates are selectable";
        window.scrollBy(0, 200);
      } else {
        window.scrollTo(0, 0);
        this.createdEvent = {
          eventName: this.name,
          eventDates: this.dateNames(d1, d2),
          eventColor: this.color,
          eventStart: this.dates[0],
          eventEnd: this.dates[1]
        };

        // this.axios
        //   .post(
        //     "http://34.82.150.138:5000/api/events/create",
        //     {
        //       title: this.createdEvent.eventName,
        //       details: "Test event created for chingu vue",
        //       color: this.createdEvent.eventColor,
        //       possibleDays: this.datesFormatter()
        //       // start: this.createdEvent.eventStart,
        //       // end: this.createdEvent.eventEnd
        //     },
        //     {
        //       headers: {
        //         "x-access-token": localStorage.getItem("token")
        //       }
        //     }
        //   )
        //   .then(
        //     response =>
        //       (this.createdEvent.eventId = response.data.msg.slice(-24))
        //   )
        //   .catch(error => (console.log(error), (this.answer = error)));

        this.slots = this.createdEvent.eventDates.length;
        for (let index = 0; index < this.slots; index++) {
          this.slotItems[index] = [this.createdEvent.eventDates[index]];
        }

        this.eventFirstValidate = true;
      }
    },
    processFormSecond() {
      this.createdEvent.eventTimeslots = this.slotItems;
      
      // console.log(
      //   this.axios
      //     .post(
      //       "http://34.82.150.138:5000/api/events/create",
      //       {
      //         title: this.createdEvent.eventName,
      //         details: "Test event created for chingu vue",
      //         color: this.createdEvent.eventColor,
      //         possibleDays: this.datesFormatter()
      //         // start: this.createdEvent.eventStart,
      //         // end: this.createdEvent.eventEnd
      //       },
      //       {
      //         headers: {
      //           "x-access-token": localStorage.getItem("token")
      //         }
      //       }
      //     )
      //     .then(
      //       response =>
      //         (this.createdEvent.eventId = response.data.msg.slice(-24))
      //     )
      //     .catch(error => (console.log(error), (this.answer = error)))
      // );

      this.eventSecondValidate = true;
    },
    dateNames(d1, d2) {
      let oneDay = 24 * 3600 * 1000;
      let array = [];
      for (let i = d1.getTime(); i <= d2.getTime(); i += oneDay) {
        let date = new Date(i);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        array.push([year, month, day]);
      }
      return array;
    },
    datesFormatter() {
      let formatted = [];
      for (
        let index = 0;
        index < this.createdEvent.eventDates.length;
        index++
      ) {
        let array = this.createdEvent.eventDates[index];
        formatted.push(array[0] + "-" + array[1] + "-" + array[2]);
      }
      return formatted;
    }
  }
};
</script>
<style lang="scss">
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
</style>
