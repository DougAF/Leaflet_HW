function createMap(quakePlot) {

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

    // Create an overlayMaps object to hold the quakePlot layer
    var overlayMaps = {
        "Epicenters": quakePlot
    };

    // Create the map object with options
    var map = L.map("map-id", {
        center: [35.73, -90],
        zoom: 4,
        layers: [lightmap, quakePlot]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);



    // Create a legend to display information about our map
    const info = L.control({
        position: "bottomright"
    });

    // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function() {
        const div = L.DomUtil.create("div", "legend");
    return div;
    };
    // Add the info legend to the map
    info.addTo(map);
}


function createCircleMarkers(response) {

    // Change the values of these options to change the symbol's appearance    
    let options = {
        radius: 8,
        fillColor: "lightgreen",
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
    // Pull the features from response
    var quakes = response.features;

    // Loop through the quake array
    const quakeMarkers = quakes.map(quake => {
        // For each station, create a marker and bind a popup with the station's name
        // coords from response contain a depth field, slice removes this
        // Reverse swaps lat and lng to map locations correctly
        const coords = quake.geometry.coordinates.slice(0,2).reverse()
        // const coords = coordsForslice.map(coord => {coord})
        const popupMsg = "<h3>" + quake.properties.title + "<h3><h3>Date: " + quake.properties.time + "<h3>";
        const quakeMarkers = L.marker(coords, options).bindPopup(popupMsg);
        // Add the marker to the quakeMarkers array
        return quakeMarkers;
    })

    // Create a layer group made from the quakeMarkers array, pass it into the createMap function
    createMap(L.layerGroup(quakeMarkers));
}


// Perform an API call to the USGS earthquake API to get quake info. Call createCircleMarkers when complete
(async function(){
    const urlGeoJSON = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
    const response = await d3.json(urlGeoJSON)
    console.log(response)
    createCircleMarkers(response)
})()
