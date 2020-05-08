<template>
  <v-container>
    <v-row justify="center">
      <v-card class="mx-auto text-center" max-width="740" v-if="!eventFirstValidate">
        <v-card-text>
          <h1>Create a new Event!</h1>
          <br>
          <input
            class="input input-long"
            v-on:keyup.enter="processFormFirst"
            type="text"
            name="name"
            v-model="name"
            placeholder="Event name"
          >
          <input
            class="input input-long"
            v-on:keyup.enter="processFormFirst"
            type="text"
            name="datails"
            v-model="details"
            placeholder="Event details"
          >
          <v-row>
            <v-col cols="12" md="6">
              <v-date-picker no-title v-model="dates" range></v-date-picker>
              <br>
              <br>
              <input
                class="input"
                type="text"
                name="Date range"
                v-model="dateRangeText"
                label="Date range"
                disabled
              >
            </v-col>
            <v-col cols="12" md="6">
              <v-color-picker
                hide-inputs
                hide-canvas
                v-model="color"
                show-swatches
                swatches-max-height="226"
              ></v-color-picker>
            </v-col>
          </v-row>

          <br>
          <v-row justify="center">
            <v-btn color="success" class="mr-4" @click="processFormFirst">Save</v-btn>
            <v-btn to="/" color="primary">Back Home</v-btn>
          </v-row>
        </v-card-text>
      </v-card>

      <br v-if="!eventFirstValidate">

      <v-card class="text-center" scrollable v-if="eventFirstValidate">
        <v-card-text>
          <h3 class="green--text">Event created! Do you want to add your timeslots?</h3>
        </v-card-text>
        <v-card-text>
          <h1>Select the times</h1>
          <br>
          <v-row align="center" justify="center" no-gutters>
            <template v-for="(slot, i) in slots">
              <v-col :key="`slot-${i}`" clos="12">
                <v-card class="mx-auto timeslots-card" :value="slot">
                  <h2 class="timeslotName">
                    {{
                    createdEvent.eventDates[i][2] + " " + months[createdEvent.eventDates[i][1]].slice(0, 3)
                    }}
                  </h2>

                  <template v-for="n in 24">
                    <label
                      :class="`checkbox-label checkbox-label-${n-1}`"
                      :key="`checkbox-label-${i}-${n}`"
                      :for="`checkbox-${i}-${n}`"
                    >
                      <input
                        :key="`checkbox-${i}-${n}`"
                        type="checkbox"
                        :id="`checkbox-${i}-${n}`"
                        :value="n-1"
                        v-model="slotItems[i]"
                        class="checkbox"
                      >
                      <span class="checkmark" :style="cssVars">{{numbering(n-1)}}</span>
                    </label>
                  </template>
                  <h4 class="undertitle-timeselection">Selections: from 0am to 23pm <br> in 1 hour intervals</h4>
                </v-card>
                <br>
              </v-col>
            </template>
          </v-row>
          <br>
          <v-row justify="center">
            <v-btn :disabled="!valid" color="success" class="mr-4" @click="processFormSecond">Save</v-btn>
            <!-- <v-btn color="error" class="mr-4" @click="reset">Reset Form</v-btn> -->
            <v-btn to="/" color="primary" v-if="!eventFirstValidate">Back Home</v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
    <br>
    <v-card class="mx-auto text-center" max-width="360" v-if="answer">
      <v-card-text>
        <h3 class="red--text" v-html="answer"></h3>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "CreateEvent",
  data: () => ({
    valid: true,
    dates: [null, null],
    name: null,
    details: null,
    color: null,
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
      eventTimeslots: []
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
    },
    cssVars(input) {
      return {
        '--bg-color': this.createdEvent.eventColor
      }
  }
  },
  mounted() {
    this.color = "#3f51b5";
  },
  methods: {
    reset() {},
    processFormFirst() {
      if (this.dates[0] == null || this.dates[1] == null) {
        this.answer =
          "Please select 2 dates as a range.<br> Ex: 21-04-2020 - 22-04-2020";
        window.scrollBy(0, 200);
        return;
      }

      if (
        !this.name ||
        !this.color ||
        !this.details ||
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
        this.answer =
          "Please select the range with the earlier date first.<br> Ex: 21-04-2020 - 22-04-2020";
        window.scrollBy(0, 200);
      } else if (this.dateNames(d1, d2).length > 10) {
        this.answer = "Currently only a range of 10 dates are selectable";
        window.scrollBy(0, 200);
      } else {
        //prevent javascript or html injection
        this.name = this.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        this.details = this.details.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        window.scrollTo(0, 0);
        this.createdEvent = {
          eventName: this.name,
          eventDetails: this.details,
          eventDates: this.dateNames(d1, d2),
          eventColor: this.color,
          eventStart: this.dates[0],
          eventEnd: this.dates[1]
        };

        this.axios
          .post(
            "https://chingutime.herokuapp.com/api/events/create",
            {
              //.post(
              //"http://localhost:5000/api/events/create",
              //{

              title: this.createdEvent.eventName,
              details: this.createdEvent.eventDetails,
              color: this.createdEvent.eventColor,
              possibleDays: this.datesFormatter(this.createdEvent.eventDates)
            },
            {
              headers: {
                "x-access-token": this.usertoken
              }
            }
          )
          .then(
            response =>
              (this.createdEvent.eventId = response.data.msg.slice(-24))
          )
          .catch(error => (console.log(error), (this.answer = error)));

        this.slots = this.createdEvent.eventDates.length;
        for (let index = 0; index < this.slots; index++) {
          this.slotItems[index] = [this.createdEvent.eventDates[index]];
        }

        this.eventFirstValidate = true;
        this.answer = null;
      }
    },
    processFormSecond() {
      this.createdEvent.eventTimeslots = [];

      for (let j = 0; j < this.slotItems.length; j++) {
        this.createdEvent.eventTimeslots.push([
          this.datesFormatterArray(this.slotItems[j][0])
        ]);

        for (let l = 1; l < this.slotItems[j].length; l++) {
          this.createdEvent.eventTimeslots[j][l] = this.slotItems[j][l];
        }
      }

      this.axios
        .post(
          "https://chingutime.herokuapp.com/api/timeslots/create",
          {
            //.post(
            //"http://localhost:5000/api/timeslots/create",
            //{
            event_id: this.createdEvent.eventId,
            timeslots: this.createdEvent.eventTimeslots
          },
          {
            headers: {
              "x-access-token": this.usertoken
            }
          }
        )
        .then(response => (this.answer = response.data.msg))
        .catch(error => (console.log(error), (this.answer = error)));

      this.$router.push({ name: "Home" });
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
    datesFormatter(input) {
      let formatted = [];
      for (let index = 0; index < input.length; index++) {
        let array = input[index];
        formatted.push(
          array[0].toString() +
            "-" +
            this.numbering(array[1]).toString() +
            "-" +
            this.numbering(array[2]).toString()
        );
      }
      return formatted;
    },
    numbering(n) {
      if (n < 10) {
        return `0${n}`;
      }
      return n;
    },
    datesFormatterArray(input) {
      return `${input[0].toString()}-${this.numbering(
        input[1]
      ).toString()}-${this.numbering(input[2]).toString()}`;
    }
  }
};
</script>
<style lang="scss" scoped>
.v-color-picker {
  align-self: inherit;
  @media (max-width: 959px) {
    margin-left: calc((100% - 300px) / 2);
  }
}

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

.timeslots-card {
  width: 320px;
  min-width: 320px;
  height: 375px;
}

//-----------------------------------------

/* The checkbox-label */
.checkbox-label {
  display: inline-block;
  position: absolute;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.undertitle-timeselection {
  padding-top: 5px;
}

$prefix: checkbox-label;
$top: 90px;
$left: 142px;

$font-list: (
  0 $prefix $top + 50px $left,
  1 $prefix $top + 60px $left + 40px,
  2 $prefix $top + 84px $left + 72px,
  3 $prefix $top + 120px $left + 85px,
  4 $prefix $top + 156px $left + 72px,
  5 $prefix $top + 180px $left + 40px,
  6 $prefix $top + 190px $left,
  7 $prefix $top + 180px $left - 40px,
  8 $prefix $top + 156px $left - 72px,
  9 $prefix $top + 120px $left - 85px,
  10 $prefix $top + 84px $left - 72px,
  11 $prefix $top + 60px $left - 40px,
  12 $prefix $top $left,
  13 $prefix $top + 20px $left + 64px,
  14 $prefix $top + 60px $left + 114px,
  15 $prefix $top + 120px $left + 135px,
  16 $prefix $top + 180px $left + 114px,
  17 $prefix $top + 220px $left + 64px,
  18 $prefix $top + 240px $left,
  19 $prefix $top + 220px $left - 64px,
  20 $prefix $top + 180px $left - 114px,
  21 $prefix $top + 120px $left - 135px,
  22 $prefix $top + 60px $left - 114px,
  23 $prefix $top + 20px $left - 64px
);
@each $value in $font-list {
  .#{nth($value, 2)}-#{nth($value, 1)} {
    top: nth($value, 3);
    left: nth($value, 4);
  }
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
  height: 35px;
  width: 35px;
  line-height: 35px;
  border-radius: 50%;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.checkbox-label:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.checkbox-label input:checked ~ .checkmark {
  background-color: var(--bg-color);
}
</style>
