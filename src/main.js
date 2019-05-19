import axios from './axios-instance'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

Vue.config.productionTip = false;

Vue.prototype.$axios = axios;

i18n.locale = store.state.locale;

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');
