import Axios from 'axios';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

Vue.config.productionTip = false;

// Now we can use `this.$http` inside any component.
Vue.prototype.$http = Axios;

const accessToken = localStorage.getItem('accessToken');

if (accessToken) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] =
      'Bearer ' + accessToken;
}

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
