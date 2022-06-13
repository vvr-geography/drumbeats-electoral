// Add all scripts to the JS folder
var map

function createMap() {

    map = L.map('map').setView([41, -74], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    const search = new GeoSearch.GeoSearchControl({
        provider: new GeoSearch.OpenStreetMapProvider(),
        /*not working
        params: {
            countrycodes: 'us'
        },*/
        style: 'bar',
        showMarker: true, // optional: true|false  - default true
        showPopup: false, // optional: true|false  - default false
        marker: {
            // optional: L.Marker    - default L.Icon.Default
            icon: new L.Icon.Default(),
            draggable: false,
        },
    });
    map.addControl(search);


    //not working
    function searchEventHandler(result) {
        console.log(result.location);
    }

    //not working
    map.on('geosearch/showlocation', searchEventHandler);


    getData();
}




function getData() {
    fetch('data/Assembly22.geojson')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {

            L.geoJSON(json, {
                style: function (feature) {
                    return L.polyline(feature)
                }
            }).addTo(map);
        })
}

//pseudocode
//1. visualize state assembly districts
//2. install autocomplete search for nys addresses (is there a built out addresses plug in?)
//2.1 zoom to search function + create marker
//3. open popup with information on recommendations for that district (if the point is inside the polygon)


document.addEventListener('DOMContentLoaded', createMap);


