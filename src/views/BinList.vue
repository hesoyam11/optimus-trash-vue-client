<template>
    <div>
        <h1>{{ $t('bins') }}</h1>
        <div class="control-panel">
            <p>{{ $t('binsCount') }}: {{ bins.count }}</p>
            <button v-if="bins.next" @click="nextPage">{{ $t('nextPage') }}</button>
            <button v-if="bins.previous" @click="previousPage">{{ $t('previousPage') }}</button>
            <p v-if="errorMessage">{{ errorMessage }}</p>
        </div>
        <div v-for="bin in bins.results" :key="bin.id" class="bin-item">
            <p>ID: {{ bin.id }}</p>
            <p>Longitude: {{ bin.longitude }}</p>
            <p>Latitude: {{ bin.latitude }}</p>
            <p>Maximum weight: {{ bin['maxWeight'].toFixed(3) }}</p>
            <p>Current weight: {{ bin['currentWeight'].toFixed(3) }}</p>
            <p>Fullness coefficient: {{ bin['fullness'].toFixed(2) }}</p>
            <button @click="showToken(bin)">Show token</button>
            <button @click="refreshToken(bin)">Refresh token</button>
            <p>Token: {{ bin['token'] }}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "BinList",
        data() {
            return {
                bins: {
                    count: 0,
                    next: '',
                    previous: '',
                    results: []
                },
                errorMessage: '',
            }
        },
        mounted() {
            this.$axios({
                url: 'api/bins/',
                params: {
                    owner: this.$store.state.userId
                },
                method: 'GET'
            })
                .then((response) => {
                    for (let binId in response.data['results']) {
                        response.data['results'][binId].token = '';
                    }
                    this.bins = response.data;
                })
                .catch((err) => {
                    this.errorMessage = err.message;
                });
        },
        methods: {
            nextPage() {
                this.$axios({
                    url: this.bins.next,
                    method: 'GET'
                })
                    .then(response => {
                        this.bins = response.data;
                    })
                    .catch(err => this.errorMessage = err.message);
            },
            previousPage() {
                this.$axios({
                    url: this.bins.previous,
                    method: 'GET'
                })
                    .then(response => {
                        this.bins = response.data;
                    })
                    .catch(err => this.errorMessage = err.message);
            },
            showToken(bin) {
                this.$axios({
                    url: `api/bins/${bin.id}/token/`,
                    method: 'GET'
                })
                    .then(response => {
                        bin.token = response.data['token'];
                    })
                    .catch(err => this.errorMessage = err.message);
            },
            refreshToken(bin) {
                if (confirm("Are you sure you want to refresh the token? " +
                    "Devices using the old token will no longer work!")
                ) {
                    this.$axios({
                        url: `api/bins/${bin.id}/token/refresh/`,
                        method: 'POST'
                    })
                        .then(response => {
                            bin.token = response.data['token'];
                        })
                        .catch(err => this.errorMessage = err.message);
                }
            }
        }
    }
</script>

<i18n>
{
    "en": {
        "bins": "Bins",
        "binsCount": "Bins Count",
        "nextPage": "Next Page",
        "previousPage": "Previous Page"
    },
    "ua": {
        "bins": "Контейнери",
        "binsCount": "Загальна кількість",
        "nextPage": "Наступна сторінка",
        "previousPage": "Попередня сторінка"
    }
}
</i18n>

<style scoped>
    p {
        margin: 5px;
    }

    .bin-item {
        border: 1px black solid;
        margin: 5px;
    }
</style>