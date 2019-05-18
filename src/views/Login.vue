<template>
  <div>
    <h1>{{ $t('loggingIn') }}</h1>
    <form class="login" @submit.prevent="login">
      <input required v-model="username" :placeholder="$t('yourUsername')"/>
      <br>
      <input required v-model="password" type="password" :placeholder="$t('yourPassword')"/>
      <br>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <button type="submit">{{ $t('login') }}</button>
    </form>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        username: "",
        password: "",
        errorMessage: ""
      }
    },
    methods: {
      login: function() {
        let username = this.username;
        let password = this.password;
        this.$store.dispatch('login', { username, password })
          .then(() => this.$router.push('/'))
          .catch(err => this.errorMessage = err.message);
      }
    }
  }
</script>

<i18n>
{
  "en": {
    "loggingIn": "Logging In",
    "yourUsername": "Your Username",
    "yourPassword": "Your Password",
    "login": "Login"
  },
  "ua": {
    "loggingIn": "Вхід у систему",
    "yourUsername": "Ваш Юзернейм",
    "yourPassword": "Ваш Пароль",
    "login": "Війти"
  }
}
</i18n>

<style scoped>

</style>