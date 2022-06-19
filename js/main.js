// find layer through point data code
L.Map.include({

    getLayerAtLatLng: function (latlng, lng) {
        latlng = L.latLng(latlng, lng);

        return this.layerAt(latLngToContainerPoint(latlng));
    },

    getLayerAt: function (point, y) {
        point = L.point(point, y);

        // Ignore points outside the map
        if (!this.getSize().contains(point)) { return; }

        var mapPos = this._container.getBoundingClientRect();

        var viewportPoint = L.point(mapPos.left, mapPos.top).add(point);

        var el = document.elementFromPoint(viewportPoint.x, viewportPoint.y);

        return this._getLayerFromDOMElement(el);
    },

    _getLayerFromDOMElement: function (el) {
        if ((!el) || el === this._container) {
            // Stop the search when the map container itself is reached (meaning no
            // layer at the requested point) or the container is undefined (the
            // DOM elements were traversed up to the Document, meaning the map
            // is invisible e.g. because CSS)
            return;
        }

        var id = L.stamp(el);
        if (id in this._targets) {

            return this._targets[id];
        }

        return this._getLayerFromDOMElement(el.parentElement);
    }

});

//start leaflet code
var map,
    geoJson;

function createMap() {

    map = L.map('map').setView([40.70, -74], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const search = new GeoSearch.GeoSearchControl({
        provider: new GeoSearch.OpenStreetMapProvider(),
        params: {
            email: 'viggyram@gmail.com',
            'accept-language': 'en', // render results in English
            countrycodes: 'us', // limit search results to Canada & United States'
        },
        style: 'bar',
        showMarker: true, // optional: true|false  - default true
        showPopup: true, // optional: true|false  - default false
        marker: {
            // optional: L.Marker    - default L.Icon.Default
            icon: new L.Icon.Default(),
            draggable: false,
            // interactive: false,
        },
        autoClose: true,
        keepResult: true,
    });
    map.addControl(search);
    map.on('geosearch/showlocation', addToSidePanel)

    getData();
}

var mapwidth = document.getElementById('map').offsetWidth / 2
var mapheight = document.getElementById('map').offsetHeight / 2

function addToSidePanel(result) {
    var point = map.project(result.marker._latlng);

    var feature = map.getLayerAt(mapwidth, mapheight).feature;

    var buttonContent = "<form action='https://findmypollsite.vote.nyc/' method='get' target='_blank'>" + "<button type='submit' class='block'>Find your poll site here</button></form>"

    var popupContent = "<h1 id='titletext'> NY State Assembly 2022 Recommendations </h1>" + "<p id='AD'><b>Assembly District: </b> " + feature.properties.ID + "</p>" + "<p id='endorsedtext'>" + drumbeatsImg + feature.properties.DRUMBeats + "</p>" + "<p id='endorsedtext'>" + DSAImg + feature.properties.DSA + "</p>" + "<p id='endorsedtext'>" + WFPImg + feature.properties.WFP + "</p>" + buttonContent
    document.getElementById("sidepanel").innerHTML = popupContent

}

// variables for images on recommendations
var drumbeatsImg = "<img src= 'https://images.squarespace-cdn.com/content/v1/609abba365e4de328b70577c/1620761752987-NHS5ATSQJDWVKZ6ZDFHK/Artboard%2B16.jpg' id='endorseImg'>"
var DSAImg = "<img src= 'https://pbs.twimg.com/profile_images/1247315123653541888/syhiJRyd_400x400.png' id='endorseImg'>"
var WFPImg = "<img src= 'https://pbs.twimg.com/profile_images/1313547246181453824/jqPnHO2d_400x400.png' id='endorseImg'>"


function onEachShapefileFeature(feature, layer) {
    var buttonContent = "<form action='https://findmypollsite.vote.nyc/' method='get' target='_blank'>" + "<button type='submit' class='block'>Find your poll site here</button></form>"
    var popupContent = "<h1 id='titletext'> NY State Assembly 2022 Recommendations </h1>" + "<p id='AD'><b>Assembly District: </b> " + feature.properties.ID + "</p>" + "<p id='endorsedtext'>" + drumbeatsImg + feature.properties.DRUMBeats + "</p>" + "<p id='endorsedtext'>" + DSAImg + feature.properties.DSA + "</p>" + "<p id='endorsedtext'>" + WFPImg + feature.properties.WFP + "</p>" + buttonContent

    var hoverStyle = {
        "color": "#A50202",
        "weight": 5,
        "opacity":1,
        "fillOpacity":0.5,
        "fillColor": "#A50202",
    }

    var regularStyle = {
        "color": "#000000",
        "weight": 1.5,
        "opacity": 0.5,
        "fillOpacity":0,
        "fillColor": "#ffffff"
    }

    layer.on({
        click: function populate() {
            document.getElementById("sidepanel").innerHTML = popupContent
        },
        mouseover: function(){
            layer.setStyle(hoverStyle)
        },
        mouseout: function(){
            layer.setStyle(regularStyle)
        }
    })



    //layer._leaflet_id = feature.id;
}

function getData() {
    fetch('data/Assembly22.geojson')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            var geoJson = L.geoJSON(json, {
                style: function (feature) {
                    return {
                        "color": "#000000",
                        "weight": 1.5,
                        "opacity": 0.5,
                        "fillOpacity":0,
                        "fillColor": "#ffffff"
                    }
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


