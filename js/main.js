// Add all scripts to the JS folder
var map

var assemblyColor = {
    "color": "#F09511",
    "weight": 3,
    "opacity": 0.4
}

function createMap() {

    map = L.map('map').setView([41, -74], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    const search = new GeoSearch.GeoSearchControl({
        provider: new GeoSearch.OpenStreetMapProvider(),
        params: {
            countrycodes: 'us'
        },
        style: 'bar',
        showMarker: true, // optional: true|false  - default true
        showPopup: false, // optional: true|false  - default false
        marker: {
            // optional: L.Marker    - default L.Icon.Default
            icon: new L.Icon.Default(),
            draggable: false,
            interactive: false,
        },
        autoClose: false,
        // resultFormat: function(){document.getElementById("sidepanel").innerHTML = result.label}
    });
    map.addControl(search);

    getData();
    // getPollSiteData()
}
/*
function pollSitePointToLayer(feature, latlng){
    var geojsonMarkerOptions = {
        radius: 3,
        fillColor: 'blue',
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    var pollSiteLayer = L.circleMarker(latlng, geojsonMarkerOptions);

    return pollSiteLayer

}

function getPollSiteData() {
    fetch("data/polling-sites-nyc22.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            L.geoJSON(json, {
                pointToLayer: pollSitePointToLayer,
            });
        })
} */

function onEachShapefileFeature(feature,layer) {
    var popupContent = "<p><b>Assembly District: </b> " + feature.properties.ID + feature.properties.DRUMBeats + "</p>"
    layer.on({
        click: function populate() {
            document.getElementById("sidepanel").innerHTML = popupContent
        }
    })
}

function getData() {
    fetch('data/Assembly22.geojson')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            L.geoJSON(json, {
                style: function (feature) {
                    return L.polyline(feature, assemblyColor)
                },
                onEachFeature: onEachShapefileFeature
            }).addTo(map);
        })
}

//pseudocode
//DONE 1. visualize state assembly districts
//DONE 2. install autocomplete search for nys addresses (is there a built out addresses plug in?)
//DONE 2.1 zoom to search function + create marker
//3. open popup with information on recommendations for that district (if the point is inside the polygon)


document.addEventListener('DOMContentLoaded', createMap);


