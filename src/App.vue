<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/register" v-if="!isLoggedIn" style="float:right" >Register</router-link>
      <router-link to="/login" v-if="!isLoggedIn" style="float:right" >Login</router-link>
      <a v-if="isLoggedIn" @click="logout" style="float:right" to="/login">Logout</a>
    </div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    computed: {
      isLoggedIn: function () {
        return this.$store.getters.isLoggedIn;
      }
    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
          .then(() => {
            this.$router.push('/');
          });
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

<style>
body {
  margin: 0;
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
