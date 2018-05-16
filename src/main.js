import Vue from 'vue';
import VueRouter from 'vue-router';
// import '../dist/style/blue/index.css'
import iView from 'bh-iview';
import App from './app.vue';
import route from './router';
import * as utils from './utils'
import api from './api'
// import fcutil from './fcUtil'

Vue.use(iView);
Vue.use(VueRouter);
const router = new VueRouter(route);

window.apiPath = "http://localhost:7001"

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
});