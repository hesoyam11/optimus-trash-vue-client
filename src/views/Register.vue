<template>
    <div>
        <h1>Registration</h1>
        <form @submit.prevent="register">
            <label for="username">Username:</label>
            <br>
            <input id="username" v-model="username" required autofocus>
            <br>

            <label for="email">Email:</label>
            <br>
            <input id="email" type="email" v-model="email" required>
            <br>

            <label for="password">Password:</label>
            <br>
            <input id="password" type="password" v-model="password" required>
            <br>

            <label for="confirm-password">Confirm password:</label>
            <br>
            <input id="confirm-password" type="password" v-model="confirmPassword" required>
            <br>

            <p v-if="errorMessage">{{ errorMessage }}</p>

            <button type="submit">Register</button>
        </form>
    </div>
</template>

<script>
    export default {
        name: "Register",
        data() {
            return {
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                errorMessage: ""
            }
        },
        methods: {
            register: function() {
                if (this.password !== this.confirmPassword) {
                    this.errorMessage = "Password confirmation failed!";
                    this.password = "";
                    this.confirmPassword = "";
                    return;
                }

                const data = {
                    username: this.username,
                    email: this.email,
                    password: this.password
                };

                this.$axios({
                    url: 'api/users/',
                    data,
                    method: 'POST'
                })
                    .then(() => this.$router.push({ name: 'login' }))
                    .catch(err => this.errorMessage = err.message);
            }
        }
    }
</script>

<style scoped>

</style>