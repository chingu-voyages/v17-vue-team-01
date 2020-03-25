import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

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