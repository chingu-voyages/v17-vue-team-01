import Vue from 'vue'
import persistentState from 'vue-persistent-state'
import './registerServiceWorker'
import router from './router'
import axios from "axios";
import VueAxios from "vue-axios";
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import App from './App.vue'

let initialState = {
  usertoken: null,
  user: null
}

// inject initialState as data
Vue.use(persistentState, initialState)

Vue.config.productionTip = false

Vue.use(VueAxios, axios, VueLodash, { name: 'custom', lodash: lodash });

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')



Vue.config.warnHandler = function(msg, vm, trace) {
    if (msg === "The .native modifier for v-on is only valid on components but it was used on <div>.") {
        msg = null;
        vm = null;
        trace = null;
    }
};