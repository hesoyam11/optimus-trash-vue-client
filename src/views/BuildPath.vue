<template>
    <div>
        <div class="two-cols">
            <div class="bins-container">
                <h2>{{ $t('yourBins') }}</h2>
                <div class="bins-panel">
                    <p>{{ $t('binsAmount') }}: {{ bins.count }}</p>
                    <p>{{ $t('pageNumber') }}: {{ pageNumber }}</p>
                    <button v-if="bins['previous']" @click="previousPage">{{ $t('previousPage') }}</button>
                    <button v-if="bins['next']" @click="nextPage">{{ $t('nextPage') }}</button>
                    <p v-if="errorMessage">{{ errorMessage }}</p>
                </div>
                <div class="bins-list">
                    <div class="bin-item" v-for="bin in bins['results']" :key="bin.id">
                        <p>ID: {{ bin.id }}</p>
                        <p>{{ $t('longitude') }}: {{ bin.longitude }}</p>
                        <p>{{ $t('latitude') }}: {{ bin.latitude }}</p>
                        <p>{{ $t('maxWeight') }}: {{ bin['maxWeight'].toFixed(3) }}</p>
                        <p>{{ $t('currentWeight') }}: {{ bin['currentWeight'].toFixed(3) }}</p>
                        <p>{{ $t('fullnessCoefficient') }}: {{ bin['fullness'].toFixed(2) }}</p>
                        <button @click="selectBin(bin)">{{ $t('selectBin') }}</button>
                    </div>
                </div>
            </div>
            <div class="bins-container">
                <h2>{{ $t('selectedBins') }}</h2>
                <div class="bins-panel">
                    <p>{{ $t('binsAmount') }}: {{ selectedBins.length }}</p>
                    <p>{{ $t('totalWeight') }}: {{ totalWeight.toFixed(3) }}</p>
                    <button @click="selectAutomatically">{{ $t('selectAutomatically') }}</button>
                    <br>
                    <button @click="clearAllSelected">{{ $t('clearAll') }}</button>
                </div>
                <div class="bins-list">
                    <div class="bin-item" v-for="bin in selectedBins" :key="bin.id">
                        <p>ID: {{ bin.id }}</p>
                        <p>{{ $t('longitude') }}: {{ bin.longitude }}</p>
                        <p>{{ $t('latitude') }}: {{ bin.latitude }}</p>
                        <p>{{ $t('maxWeight') }}: {{ bin['maxWeight'].toFixed(3) }}</p>
                        <p>{{ $t('currentWeight') }}: {{ bin['currentWeight'].toFixed(3) }}</p>
                        <p>{{ $t('fullnessCoefficient') }}: {{ bin['fullness'].toFixed(2) }}</p>
                        <button @click="removeBin(bin)">{{ $t('removeBin') }}</button>
                    </div>
                </div>
            </div>
        </div>

        <h2>{{ $t('path') }}</h2>
        <button @click="buildPath">{{ $t('buildPath') }}</button>
        <div id="map"></div>
        <div id="directionsPanel"></div>
    </div>
</template>

<script>
    import gmapsInit from '../utils/gmaps';

    export default {
        name: "BuildPath",
        data() {
            return {
                bins: {},
                pageNumber: 1,
                errorMessage: '',
                selectedBins: [],
                google: {},
                map: {},
                bounds: {},
                directionsService: {},
                directionsRenderer: {},
                origin: null
            }
        },
        computed: {
            totalWeight() {
                let res = 0;
                for (let i in this.selectedBins) {
                    res += this.selectedBins[i]['currentWeight'];
                }
                return res;
            }
        },
        async mounted() {
            this.$axios({
                url: 'api/bins/',
                params: {
                    ordering: '-fullness',
                    owner: this.$store.state.userId
                },
                method: 'GET'
            })
                .then(response => {
                    this.bins = response.data;
                })
                .catch(err => this.errorMessage = err.message);

            try {
                this.google = await gmapsInit();
                this.map = new this.google.maps.Map(document.getElementById('map'));
                let self = this;
                this.google.maps.event.addListener(this.map, 'click', function(event) {
                    if (self.origin) {
                        self.origin.setMap(null);
                    }
                    self.origin = new self.google.maps.Marker({
                        position: event.latLng,
                        label: 'X',
                        map: self.map
                    });
                });
                this.bounds = new this.google.maps.LatLngBounds();
                this.directionsService = new this.google.maps.DirectionsService;
                this.directionsRenderer = new this.google.maps.DirectionsRenderer;
                this.directionsRenderer.setMap(this.map);
                this.directionsRenderer.setPanel(document.getElementById('directionsPanel'));
            }
            catch(error) {
                console.error(error);
            }
        },
        methods: {
            previousPage() {
                this.$axios({
                    url: this.bins['previous'],
                    method: 'GET'
                })
                    .then(response => {
                        this.bins = response.data;
                        this.pageNumber--;
                    })
                    .catch(err => this.errorMessage = err.message);
            },
            nextPage() {
                this.$axios({
                    url: this.bins['next'],
                    method: 'GET'
                })
                    .then(response => {
                        this.bins = response.data;
                        this.pageNumber++;
                    })
                    .catch(err => this.errorMessage = err.message);
            },
            selectBin(bin) {
                for (let selectedBin in this.selectedBins) {
                    if (bin.id === this.selectedBins[selectedBin].id) {
                        return; // if it is already selected
                    }
                }
                bin.marker = new this.google.maps.Marker({
                    position: {
                        lng: bin.longitude,
                        lat: bin.latitude
                    },
                    label: bin.id.toString(),
                    map: this.map
                });
                this.selectedBins.push(bin);
                this.bounds.extend(bin.marker.position);
                this.map.fitBounds(this.bounds);
            },
            removeBin(bin) {
                bin.marker.setMap(null);
                this.selectedBins = this.selectedBins.filter(b => b !== bin);
            },
            selectAutomatically() {
                for (let bin in this.bins['results']) {
                    this.selectBin(this.bins['results'][bin]);
                }
            },
            clearAllSelected() {
                for (let i in this.selectedBins) {
                    this.selectedBins[i].marker.setMap(null);
                }
                this.selectedBins = [];
            },
            buildPath() {
                if (!this.origin) {
                    alert('You have to specify the origin of a path by clicking on the map.');
                    return;
                }
                if (this.selectedBins.length < 1) {
                    alert('You have to select at least 1 bin!');
                    return;
                }
                let directionsRenderer = this.directionsRenderer;
                let waypoints = [];
                for (let i in this.selectedBins) {
                    waypoints.push(
                        {
                            location: this.selectedBins[i].marker.position,
                            stopover: false
                        }
                    );
                }
                this.directionsService.route(
                    {
                        origin: this.origin.position,
                        destination: this.origin.position,
                        waypoints,
                        optimizeWaypoints: true,
                        unitSystem: this.google.maps.UnitSystem.METRIC,
                        travelMode: 'DRIVING'
                    },
                    function(response, status) {
                        if (status === 'OK') {
                            directionsRenderer.setDirections(response);
                        }
                        else {
                            alert('Directions request failed due to ' + status);
                        }
                    }
                );
            }
        }
    }
</script>

<i18n>
{
    "en": {
        "yourBins": "Your Bins",
        "selectedBins": "Selected Bins",
        "binsAmount": "Bins Amount",
        "totalWeight": "Total Weight",
        "pageNumber": "Page Number",
        "nextPage": "Next Page",
        "previousPage": "Previous Page",
        "selectAutomatically": "Select Automatically",
        "clearAll": "Clear All",
        "id": "ID",
        "longitude": "Longitude",
        "latitude": "Latitude",
        "maxWeight": "Maximum weight",
        "currentWeight": "Current weight",
        "fullnessCoefficient": "Fullness coefficient",
        "selectBin": "Select Bin",
        "removeBin": "Remove Bin",
        "path": "Path",
        "buildPath": "Build a Path"
    },
    "uk": {
        "yourBins": "Ваші Контейнери",
        "selectedBins": "Вибрані Контейнери",
        "binsAmount": "Кількість контейнерів",
        "totalWeight": "Загальна вага сміття",
        "pageNumber": "Номер сторінки",
        "nextPage": "Наступна сторінка",
        "previousPage": "Попередня сторінка",
        "selectAutomatically": "Вибрати автоматично",
        "clearAll": "Видалити всі",
        "id": "ID",
        "longitude": "Довгота",
        "latitude": "Широта",
        "maxWeight": "Максимальна вага",
        "currentWeight": "Поточна вага",
        "fullnessCoefficient": "Коефіціент заповненості",
        "selectBin": "Вибрати",
        "removeBin": "Видалити",
        "path": "Шлях",
        "buildPath": "Побудувати шлях"
    }
}
</i18n>

<style scoped>
    p {
        margin: 5px;
    }

    #map {
        background-color: darkgrey;
        width: 100%;
        height: 800px;
        border: black 1px solid;
    }

    .two-cols {
        display: flex;
        width: 100%;
    }

    .bins-container {
        flex: 1;
        padding: 5px;
    }

    .bins-panel {
        height: 120px;
    }

    .bins-list {
        height: 500px;
        overflow: scroll;
        border: darkcyan 2px solid;
    }

    .bin-item {
        box-sizing: border-box;
        border: green 1px solid;
        margin: 5px;
    }
</style>