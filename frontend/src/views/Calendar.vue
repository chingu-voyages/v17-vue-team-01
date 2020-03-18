<template>
   <v-row class="calendar">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" color="grey darken-2">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" >
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ "March" }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
                outlined
                color="grey darken-2"
              >
                <span>{{ "Month" }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="70vh" class="calendarRows">
        <v-calendar
          ref="calendar"
          :now="today"
          :value="today"
          :events="events"
          color="primary"
          type="month"
        ></v-calendar>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    data: () => ({
      today: '2020-03-16',
      events: [],
    }),
    mounted () {
      this.createEvents();
      this.$refs.calendar.checkChange()
    },
    methods: {
      createEvents() {
        let dates = [];
        for (let i = 0; i < 6; i++) {
          let month = 3;
          let date = 8 + 7*i;
          if (date > 31) {
            month = 4
            date = date - 31; 
          }
          if (date < 10) {
            date = "0" + date.toString(); 
          }
          dates.push({
            name: "Weekly V17 Meeting",
            start: `2020-`+month+`-`+date+` 17:00`,
            end: `2020-`+month+`-`+date+` 17:00`,
          })
        }
        this.events = dates;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
  left: 4px;
  margin-right: 8px;
  position: relative;
}

.my-event.with-time {
  position: absolute;
  right: 4px;
  margin-right: 0px;
}

.calendarRows {
  margin-top: 8px;
}
</style>
