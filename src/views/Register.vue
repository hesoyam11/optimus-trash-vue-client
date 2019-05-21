<template>
    <div>
        <h1>{{ $t('registration') }}</h1>
        <form @submit.prevent="register">
            <label for="username">{{ $t('username') }}:</label>
            <br>
            <input id="username" v-model="username" required autofocus>
            <br>

            <label for="email">{{ $t('email') }}:</label>
            <br>
            <input id="email" type="email" v-model="email" required>
            <br>

            <label for="password">{{ $t('password') }}:</label>
            <br>
            <input id="password" type="password" v-model="password" required>
            <br>

            <label for="confirm-password">{{ $t('confirmPassword') }}:</label>
            <br>
            <input id="confirm-password" type="password" v-model="confirmPassword" required>
            <br>

            <p v-if="errorMessage">{{ errorMessage }}</p>

            <button type="submit">{{ $t('register') }}</button>
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

<i18n>
{
    "en": {
        "registration": "Registration",
        "username": "Username",
        "email": "Email",
        "password": "Password",
        "confirmPassword": "Confirm password",
        "register": "Register"
    },
    "uk": {
        "registration": "Реєстрація",
        "username": "Юзернейм",
        "email": "Електрона пошта",
        "password": "Пароль",
        "confirmPassword": "Підтвердження паролю",
        "register": "Зареєструватися"
    }
}
</i18n>