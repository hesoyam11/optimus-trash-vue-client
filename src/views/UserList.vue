<template>
    <div>
        <h1>Users</h1>
        <div class="control-panel">
            <p>Users Count: {{ users.count }}</p>
            <button v-if="users.next" @click="nextPage">Next Page</button>
            <button v-if="users.previous" @click="previousPage">Previous Page</button>
            <p v-if="errorMessage">{{ errorMessage }}</p>
        </div>
        <div>
            <div v-for="user in users.results" :key="user.username" class="user-card">
                <p>Username: {{ user.username }}</p>
                <p>Email: {{ user.email }}</p>
                <p>First Name: {{ user['firstName'] }}</p>
                <p>Last Name: {{ user['lastName'] }}</p>
                <p>Is Confirmed: {{ user['isConfirmed'] }}</p>
                <button @click="toggleConfirmation(user)">
                    {{ user.isConfirmed ? "Reset Confirmation" : "Confirm" }}
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