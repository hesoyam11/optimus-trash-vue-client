<template>
    <div>
        <h1>{{ $t('users') }}</h1>
        <div class="control-panel">
            <p>{{ $t('usersCount') }}: {{ users.count }}</p>
            <button v-if="users.next" @click="nextPage">{{ $t('nextPage') }}</button>
            <button v-if="users.previous" @click="previousPage">{{ $t('previousPage') }}</button>
            <p v-if="errorMessage">{{ errorMessage }}</p>
        </div>
        <div>
            <div v-for="user in users.results" :key="user.username" class="user-card">
                <p>{{ $t('username') }}: {{ user.username }}</p>
                <p>{{ $t('email') }}: {{ user.email }}</p>
                <p>{{ $t('firstName') }}: {{ user['firstName'] }}</p>
                <p>{{ $t('lastName') }}: {{ user['lastName'] }}</p>
                <p>{{ $t('isConfirmed') }}: {{ user['isConfirmed'] }}</p>
                <button @click="toggleConfirmation(user)">
                    {{ user.isConfirmed ? $t('resetConfirmation') : $t('confirm') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserList",
        data() {
            return {
                users: {
                    count: 0,
                    next: '',
                    previous: '',
                    results: []
                },
                pageNumber: 1,
                errorMessage: ''
            }
        },
        mounted() {
            this.$axios({
                url: 'api/users/',
                params: {
                    ordering: '-date_joined'
                },
                method: 'GET'
            })
                .then(response => {
                    this.users = response.data;
                })
                .catch(err => this.errorMessage = err.message);

        },
        methods: {
            toggleConfirmation(user) {
                this.$axios({
                    url: user.url + 'confirmation/',
                    data: {
                        isConfirmed: !user.isConfirmed
                    },
                    method: 'POST'
                })
                    .then(() => {
                        user.isConfirmed = !user.isConfirmed;
                    })
                    .catch(err => this.errorMessage = err.message);
            },
            nextPage() {
                this.$axios({
                    url: this.users.next,
                    method: 'GET'
                })
                    .then(response => {
                        this.users = response.data;
                    })
                    .catch(err => this.errorMessage = err.message);
            },
            previousPage() {
                this.$axios({
                    url: this.users.previous,
                    method: 'GET'
                })
                    .then(response => {
                        this.users = response.data;
                    })
                    .catch(err => this.errorMessage = err.message);
            }
        }
    }
</script>

<i18n>
{
    "en": {
        "users": "Users",
        "usersCount": "Users Count",
        "nextPage": "Next Page",
        "previousPage": "Previous Page",
        "isConfirmed": "Is Confirmed",
        "confirm": "Confirm",
        "resetConfirmation": "Reset Confirmation",
        "username": "Username",
        "email": "Email",
        "firstName": "First Name",
        "lastName": "Last Name"
    },
    "uk": {
        "users": "Користувачі",
        "usersCount": "Загальна кількість",
        "nextPage": "Наступна сторінка",
        "previousPage": "Попередня сторінка",
        "isConfirmed": "Підтвердження",
        "confirm": "Підтвердити",
        "resetConfirmation": "Скасувати підтвердження",
        "username": "Юзернейм",
        "email": "Електрона пошта",
        "firstName": "Імʼя",
        "lastName": "Прізвище"
    }
}
</i18n>

<style scoped>
    p {
        margin: 5px;
    }

    .control-panel {
        height: 100px;
    }

    .user-card {
        border: black 1px solid;
        margin: 5px;
    }
</style>