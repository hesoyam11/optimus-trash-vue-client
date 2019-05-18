<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <a @click="switchLocale" style="float:right">{{ locale === 'en' ? 'UA' : 'EN' }}</a>
      <router-link to="/register" v-if="!isLoggedIn" style="float:right">{{ $t('register') }}</router-link>
      <router-link to="/login" v-if="!isLoggedIn" style="float:right" >{{ $t('login') }}</router-link>
      <a v-if="isLoggedIn" @click="logout" style="float:right">{{ $t('logout') }}</a>
      <router-link :to="userIdLink" v-if="isLoggedIn" style="float: right">
        {{ $t('myAccount') }}
      </router-link>
    </div>
    <div id="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import i18n from './i18n.js'

  export default {
    data: function() {
      return {
        locale: localStorage.getItem('locale') || 'en',
      }
    },
    computed: {
      isLoggedIn: function () {
        return this.$store.getters.isLoggedIn;
      },
      userIdLink: function() {
        const link = 'users/' + this.$store.getters.userId;
        console.log(link);
        return link;
      }
    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
          .then(() => {
            this.$router.push('/');
          });
      },
      switchLocale: function() {
        i18n.locale = i18n.locale === 'en' ? 'ua' : 'en';
        this.locale = i18n.locale;
        localStorage.setItem('locale', this.locale);
      }
    },
    created: function() {
      this.$http.interceptors.response.use(undefined, function(err) {
        return new Promise(function(resolve, reject) {
          if (err.status === 401 && err.config) {
            this.$store.dispatch('logout')
              .then(() => {
                console.log('Token is expired, logging out.');
                resolve();
              })
              .err(() => {
                reject();
              });
            }
        });
      });
    }
  }
</script>

<i18n>
{
  "en": {
    "login": "Login",
    "logout": "Logout",
    "register": "Register",
    "myAccount": "My Account"
  },
  "ua": {
    "login": "Увійти",
    "logout": "Вийти",
    "register": "Зареєструватися",
    "myAccount": "Мій Аккаунт"
  }
}
</i18n>

<style>
html {
  background-color: cadetblue;
}

body {
  margin: 0;
}

#content {
  max-width: 900px;
  padding: 10px;
  background-color: white;
  margin: 0 auto;
  min-height: 500px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  margin: 0;
  background-color: #333;
}

#nav a {
  font-weight: bold;
  text-decoration: none;
  color: white;
  display: inline-block;
  padding: 14px 16px;
}

#nav a:hover {
  background-color: #111;
}

#nav a.router-link-exact-active {
  background-color: #42b983;
}
</style>
