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
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="text-center">
        <v-btn to="/" color="primary">Back Home</v-btn>
      </v-card-actions>
    </v-card>
    <br v-if="!eventFirstValidate">
    <v-card class="mx-auto" max-width="700" v-if="eventFirstValidate">
      <v-card-text>
        <h1>Select the times</h1>
        <br>
        <v-form ref="form" v-model="valid" lazy-validation>
          <template>
            <v-row>
              <template v-for="(slot, i) in slots">
                <v-divider v-if="!slot" :key="`divider-${i}`"></v-divider>
                <v-card class="mx-auto" max-width="160" :key="`slot-${i}`" :value="slot">
                  <h2>{{slotNames[i]}}</h2>
                  <v-container fluid>
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
                  </v-container>
                </v-card>
              </template>
            </v-row>
          </template>
          <br>
          <v-row justify="center">
            <v-btn :disabled="!valid" color="success" class="mr-4" @click="processFormSecond">Save</v-btn>

            <v-btn color="error" class="mr-4" @click="reset">Reset Form</v-btn>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="text-center">
        <v-btn to="/" color="primary">Back Home</v-btn>
      </v-card-actions>
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
    slotNames: null,
    createdEvent: {
      eventName: null,
      eventDates: null,
      eventColor: null,
      eventTimeslots: {}
    },
    nameRules: [v => !!v || "Name is required"]
  }),
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
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
      if (!this.name || !this.color || !this.dates) {
        this.answer = "Please fill out all the fields.";
      } else {
        this.createdEvent = {
          eventName: this.name,
          eventDates: this.dates,
          eventColor: this.color
        };
        this.timeDifference();
        this.dateNames();
        for (let index = 0; index < this.slots; index++) {
          this.slotItems[index] = [this.slotNames[index]];
        }
        this.eventFirstValidate = true;
      }
    },
    timeDifference() {
      let dateSplit1 = this.dates[0].split("-");
      let dateSplit2 = this.dates[1].split("-");
      let date1 = new Date(Number(dateSplit1[0]), Number(dateSplit1[1])-1, Number(dateSplit1[2]));
      let date2 = new Date(Number(dateSplit2[0]), Number(dateSplit2[1])-1, Number(dateSplit2[2]));
      let DifferenceDays =
        (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);
      this.slots = DifferenceDays + 1;
    },
    dateNames() {
      let dateSplit1 = "2020-04-02".split("-");
      let dateSplit2 = "2020-04-03".split("-");
      let d1 = new Date(dateSplit1[0], dateSplit1[1]-1, dateSplit1[2]);
      let d2 = new Date(dateSplit2[0], dateSplit2[1]-1, dateSplit2[2]);
      let oneDay = 24 * 3600 * 1000;
      let array = [];
      for (let i = d1.getTime(); i <= d2.getTime(); i += oneDay) {
        array.push(new Date(i).toDateString());
      }
      this.slotNames = array;
    }
  }
};
</script>
