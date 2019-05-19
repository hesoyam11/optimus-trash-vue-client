import axios from './axios-instance'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        accessToken: '',
        userId: 0,
        isSuperuser: false,
        isConfirmed: false,

        locale: 'en',
    },

    // automatically saves `state` in `localStorage`!
    plugins: [createPersistedState()],

    getters: {
        isLoggedIn: state => !!state.accessToken
    },

    mutations: {
        LOGIN_SUCCESS(state, payload) {
            state.accessToken = payload.accessToken;
            state.userId = payload.userId;
            state.isSuperuser = payload.isSuperuser;
            state.isConfirmed = payload.isConfirmed;
        },

        LOGIN_FAILURE(state) {
            state.accessToken = '';
        },

        LOGOUT(state) {
            state.accessToken = '';
        },

        SET_LOCALE(state, locale) {
            state.locale = locale;
        }
    },

    actions: {

        login({commit}, {username, password}) {
            return new Promise((resolve, reject) => {
                axios({
                    url: 'api/token/',
                    data: {
                        username,
                        password
                    },
                    method: 'POST'
                })
                    .then(response => {
                        const accessToken = response.data["access"];

                        // retrieving `user_id` from the payload of a JWT
                        const base64Url = accessToken.split('.')[1];
                        const base64 = base64Url.replace('-', '+')
                            .replace('_', '/');
                        const payloadObject = JSON.parse(atob(base64));
                        const userId = payloadObject["user_id"];

                        // fetching the additional user's account information
                        axios({
                            url: 'api/users/' + userId,
                            method: 'GET'
                        })
                            .then(response => {
                                const user = response.data;
                                commit('LOGIN_SUCCESS', {...user, userId, accessToken});
                                axios.defaults.headers.common['Authorization'] =
                                    'Bearer ' + accessToken;
                                resolve();
                            })
                            .catch(err => {
                                commit('LOGIN_FAILURE');
                                reject(err);
                            });
                    })
                    .catch(err => {
                        commit('LOGIN_FAILURE');
                        reject(err);
                    });
            });
        },

        logout({commit}) {
            commit('LOGOUT');
            delete axios.defaults.headers.common['Authorization'];
        }
    }
})
