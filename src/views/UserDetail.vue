<template>
  <div>
    <h1>User Account</h1>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p>Username: {{user["username"]}}</p>
    <p>Email: {{user["email"]}}</p>
    <p>First Name: {{user["firstName"]}}</p>
    <p>Last Name: {{user["lastName"]}}</p>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        user: {},
        errorMessage: ""
      }
    },
    name: "UserDetail",
    mounted: function() {
      this.$http({
        url: process.env.VUE_APP_BACKEND_ADDRESS + 'api/users/' + this.$route.params["id"],
        method: 'GET'
      })
        .then(response => {
          this.user = response.data;
        })
        .catch(err => {
          this.errorMessage = err.message;
        })
    }
  }
</script>

<style scoped>

</style>