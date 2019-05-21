<template>
    <div>
        <div class="two-cols">
            <div class="bins-container">
                <h2>Your Bins</h2>
                <div class="bins-panel">
                    <p>Bins Amount: {{ bins.count }}</p>
                    <p>Page Number: {{ pageNumber }}</p>
                    <button v-if="bins['previous']" @click="previousPage">Previous Page</button>
                    <button v-if="bins['next']" @click="nextPage">Next Page</button>
                    <p v-if="errorMessage">{{ errorMessage }}</p>
                </div>
                <div class="bins-list">
                    <div class="bin-item" v-for="bin in bins['results']" :key="bin.id">
                        <p>ID: {{ bin.id }}</p>
                        <p>Owner: {{ bin.owner }}</p>
                        <p>Longitude: {{ bin.longitude }}</p>
                        <p>Latitude: {{ bin.latitude }}</p>
                        <p>Maximum weight: {{ bin['maxWeight'].toFixed(3) }}</p>
                        <p>Current weight: {{ bin['currentWeight'].toFixed(3) }}</p>
                        <p>Fullness coefficient: {{ bin['fullness'].toFixed(2) }}</p>
                        <button @click="selectBin(bin)">Select Bin</button>
                    </div>
                </div>
            </div>
            <div class="bins-container">
                <h2>Selected Bins</h2>
                <div class="bins-panel">
                    <p>Bins Amount: {{ selectedBins.length }}</p>
                    <p>Total Weight: {{ totalWeight.toFixed(3) }}</p>
                    <button @click="selectAutomatically">Select Automatically</button>
                    <br>
                    <button @click="clearAllSelected">Clear All</button>
                </div>
                <div class="bins-list">
                    <div class="bin-item" v-for="bin in selectedBins" :key="bin.id">
                        <p>ID: {{ bin.id }}</p>
                        <p>Owner: {{ bin.owner }}</p>
                        <p>Longitude: {{ bin.longitude }}</p>
                        <p>Latitude: {{ bin.latitude }}</p>
                        <p>Maximum weight: {{ bin['maxWeight'].toFixed(3) }}</p>
                        <p>Current weight: {{ bin['currentWeight'].toFixed(3) }}</p>
                        <p>Fullness coefficient: {{ bin['fullness'].toFixed(2) }}</p>
                        <button @click="removeBin(bin)">Remove Bin</button>
                    </div>
                </div>
            </div>
        </div>

        <h2>Path</h2>
        <button @click="buildPath">Build a Path</button>
        <div id="map"></div>
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
                console.log(this.directionsService, this.directionsRenderer);
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