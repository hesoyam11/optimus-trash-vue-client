<template>
    <div>
        <h1>{{ $t('userAccount') }}</h1>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <p>{{ $t('username') }}: {{ user["username"] }}</p>
        <p>{{ $t('email') }}: {{ user["email"] }}</p>
        <p>{{ $t('firstName') }}: {{ user["firstName"] }}</p>
        <p>{{ $t('lastName') }}: {{ user["lastName"] }}</p>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                user: {},
                errorMessage: ""
            }
        },
        name: "UserDetail",
        mounted: function () {
            this.$axios({
                url: 'api/users/' + this.$route.params["id"],
                method: 'GET'
            })
                .then(response => this.user = response.data)
                .catch(err => this.errorMessage = err.message);
        }
    }
</script>

<i18n>
{
    "en": {
        "userAccount": "User Account",
        "username": "Username",
        "email": "Email",
        "firstName": "First Name",
        "lastName": "Last Name"
    },
    "uk": {
        "userAccount": "Аккаунт Користувача",
        "username": "Юзернейм",
        "email": "Електрона пошта",
        "firstName": "Імʼя",
        "lastName": "Прізвище"
    }
}
</i18n>