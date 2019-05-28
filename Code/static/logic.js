function createMap(bikeStations) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Light Map": lightmap
    };

    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
        "Epicenters": bikeStations
    };

    // Create the map object with options
    var map = L.map("map-id", {
        center: [35.73, -95],
        zoom: 5,
        layers: [lightmap, bikeStations]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}

function createMarkers(response) {

    // Pull the "stations" property off of response.data
    var stations = response.data.stations;

    // Loop through the stations array
    const bikeMarkers = stations.map(station => {
        // For each station, create a marker and bind a popup with the station's name
        const coord = [station.lat, station.lon];
        const popupMsg = "<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "<h3>";
        const bikeMarker = L.marker(coord).bindPopup(popupMsg);
        // Add the marker to the bikeMarkers array
        return bikeMarker;
    })

    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(bikeMarkers));
}


// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
// url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
(async function(){
    const url = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json"
    const response = await d3.json(url)
    createMarkers(response)
})()
