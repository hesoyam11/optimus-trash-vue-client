import Axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    accessToken: localStorage.getItem('accessToken') || '',
    userId: localStorage.getItem('userId') || ''
  },
  getters: {
    isLoggedIn: state => !!state.accessToken,
    authStatus: state => state.status
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, accessToken, userId) {
      state.status = 'success';
      state.accessToken = accessToken;
      state.userId = userId;
    },
    auth_error(state) {
      state.status = 'error';
    },
    logout(state) {
      state.status = '';
      state.accessToken = '';
    }
  },
  actions: {
    login({commit}, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        Axios({
          url: 'http://localhost:8000/api/token/',
          data: user,
          method: 'POST'
        })
          .then(response => {
            const accessToken = response.data["access"];

            // retrieving `user_id` from the payload of a JWT
            let base64Url = accessToken.split('.')[1];
            let base64 = base64Url.replace('-', '+')
                .replace('_', '/');
            let payloadObject = JSON.parse(atob(base64));
            const userId = payloadObject["user_id"];

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userId', userId);

            Axios.defaults.headers.common['Authorization'] =
                'Bearer ' + accessToken;

            commit('auth_success', accessToken, userId);
            resolve(response);
          })
          .catch(err => {
            commit('auth_error');
            localStorage.removeItem('accessToken');
            reject(err);
          });
      })
    },
    register({commit}, user) {
      commit('auth_request');
      return new Promise((resolve, reject) => {
        Axios({
          url: 'http://localhost:8000/api/users/',
          data: user,
          method: 'POST'
        })
          .then(response => {
            commit('auth_error');
            resolve(response);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    logout({commit}) {
      return new Promise((resolve) => {
        commit('logout');
        localStorage.removeItem('accessToken');
        delete Axios.defaults.headers.common['Authorization'];
        resolve();
      })
    }
  }
})
