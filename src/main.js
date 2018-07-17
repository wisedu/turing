import Vue from 'vue';
import VueRouter from 'vue-router';
// import '../dist/style/blue/index.css'
import App from './app.vue';
import route from './router';

// import fcutil from './fcUtil'

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