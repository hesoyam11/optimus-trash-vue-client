<template>
    <div>
        <h1>Logging In</h1>
        <form class="login" @submit.prevent="login">
            <input required v-model="username" placeholder="Your Username"/>
            <br>
            <input required v-model="password" type="password" placeholder="Your Password"/>
            <br>
            <p v-if="errorMessage">{{ errorMessage }}</p>
            <button type="submit">Login</button>
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

<style scoped>

</style>