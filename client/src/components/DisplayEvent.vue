<template>
  <v-card class="pa-2" outlined tile>
    <v-sheet v-if="eventPart">
      <!--<p>Event: {{ eventPart }}</p>-->
      <!--<p>Route: /event/{{ url }}</p>-->
      <p>Event title: {{ eventPart.title }}</p>
      <!--<p>Timeslots: {{ timeslotPart }} </p>-->
      <p>Users:</p>
      
      <!-- <v-list :shaped="shaped">
        <v-list-item-group v-model="event" color="primary">
          <v-list-item :inactive="inactive" v-for="(participants, i) in eventPart.users" :key="i">
            <v-list-item-content class="text-left">
              <v-list-item-title>
                {{ participants.username }} <span v-if="i==0"> (Event Creator) </span>
              </v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list> -->
      
      <v-list :shaped ="shaped">
      <div>
        <span class="mr-8 mb-8" :inactive="inactive" v-for="(participants, i) in eventPart.users" :key="i">
          {{ participants.username }} <span v-if="participants.username == user.username"> (You) </span>
        </span>
      </div>
      </v-list>
      
      <p v-if="eventPart.scheduled" class="mt-5">Event is already scheduled, nonetheless here you have the calendar:</p>
      <p v-else class="mt-5">Current Event Calendar:</p>
      
        <v-row align="center" justify="center" no-gutters>
          <template v-for="(day, i) in this.eventPart.possibleDays">
            <v-col :key="`day-${i}`">
              <v-card class="mx-auto" max-width="110" :value="day">
                <h3 class="timeslotName">
                  {{
                  day
                  }}
                </h3>
                <v-col>
                  <template v-for="n in 24">
                    <label
                      class="checkbox-label"
                      :key="`checkbox-label-${i}-${n}`"
                      :for="`checkbox-${i}-${n}`"
                    >
                     
                       {{numbering(n-1)}}:00
     
                          <div class="rounded text-center" :style="{ background: computedClass(day, n-1, eventPart.color, eventPart.users.length ) }">
                          {{computedUsers(day, n-1 )}}</div>
                     
                      <input
                        :key="`checkbox-${i}-${n}`"
                        type="checkbox"
                        :id="`checkbox-${i}-${n}`"
                        :value="n-1"
                        class="checkbox"
                        :checked="computedChecked(day, n-1, user._id)"
                        @click="alert(day, n-1)"
                        :disabled="eventPart.scheduled"
                      >
                      <span class="checkmark"></span>
                    </label>
                  </template>
                </v-col>
              </v-card>
              <br>
            </v-col>
          </template>
        </v-row>





      <!--<v-list :shaped ="shaped">
      <div>
        <v-row>
        <span class="mx-8 mb-8" :inactive="inactive" v-for="(participants, i) in eventPart.users" :key="i">
          {{ participants.username }}
          <span class="mx-5 mb-8" :inactive="inactive" v-for="(timeslot, i) in changeToUserTZ" :key="i">
            <v-col>{{ timeslot.day }} - {{ timeslot.time }}:00</v-col>
          </span>
        </span>  
        </v-row>    
      </div>
      </v-list>-->
     
      <!-- <v-list :shaped="shaped">
      <v-list-item-group v-model="event" color="primary">
          <v-list-item :inactive="inactive" v-for="(timeslot, i) in changeToUserTZ" :key="i">
            <v-list-item-content class="text-left">
              <v-list-item-title>
                Day {{ timeslot.day }} Time {{ timeslot.time  }}
              </v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list> -->
      
    </v-sheet>


      <p>Advisable Timeslots: {{ advisableTimeslots }} </p>
      
  </v-card>
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
  data: () => ({
    //slotItems: [],
  }),
  watch: {},
  mounted() {
    
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
    computedClass(i, n, c, numberUsers) {
      const colorBase = this.pSBC(0.9,c,false,true);
      //console.log(colorBase);
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

    computedUsers(i, n) {
      let countU = 0;
      this.changeToUserTZ.forEach(function (tmsl){ 
        if(i == tmsl.day && n == tmsl.time){
          countU++;
        }
      })
      return countU;
    },
  },
  
  computed: {
    

    changeToUserTZ() {
      //console.log(this.user.TZ);
      //console.log(this.timeslotPart);
      this.timeslotPart.forEach(timeslot => {
        timeslot.time = parseInt(timeslot.time) + parseInt(this.user.TZ);
        if(timeslot.time < 0){
          let dateDay = new Date(timeslot.day);
          let newDate = new Date(dateDay.setTime( dateDay.getTime() - 1 * 86400000 ));
          timeslot.day = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + (newDate.getDate()); 
          timeslot.time = timeslot.time + 24;
        }
        if(timeslot.time > 23){
          let dateDay = new Date(timeslot.day);
          let newDate = new Date(dateDay.setTime( dateDay.getTime() + 1 * 86400000 ));
          timeslot.day = newDate.getFullYear() + '-' + ("0" + (newDate.getMonth() + 1)).slice(-2) + '-' + (newDate.getDate()); 
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