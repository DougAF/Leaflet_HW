function createMap(quakePlot) {

    // Create the tile layer that will be the background of our map
    const lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Create Darkmap background
    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Create satellite Background
    const satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    })


    // Create a baseMaps object to hold the lightmap layer
    const baseMaps = {
        "Light Map": lightmap,
        "Dark Map" : darkmap,
        "Satellite Image" : satellite
    };

    // Create an overlayMaps object to hold the quakePlot layer
    let overlayMaps = {
        "<b>Earthquake Epicenters</b><hr>Click a Cirlce for more info!<br><small>'M' = Magnitude or Power of the Seismic Event</small>": quakePlot
    };

    // Create the map object with options
    let map = L.map("map-id", {
        center: [35.73, -90],
        zoom: 4,
        layers: [lightmap, darkmap, quakePlot]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);



    // Create and add Legend
    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'legend');
        const labels = ['0-1', '1-3', '3-5', '5-7', '>7']
        const colors = ['green', 'yellow', 'orange', 'red', 'grey']
        div.innerHTML = '<b><font color="grey">Magnitude</font></b>';
             for (let i = 0; i < colors.length; i++){
                div.innerHTML +=
                '<li style="background-color:' + colors[i] + '">' +'<b>' + labels[i] + '</b>'+ '</li>';        }
        return div;
    }    
     // Add the info legend to the map
    legend.addTo(map);
};


function createCircleMarkers(response) {

    

    // Pull the features from response
    let quakes = response.features;

    // Loop through the quake array
    const quakeMarkers = quakes.map(quake => {

        // For each station, create a marker and bind a popup with the station's name
        // coords from response contain a depth field, slice removes this
        // Reverse swaps lat and lng to map locations correctly
        const coords = quake.geometry.coordinates.slice(0,2).reverse()

        // Change the values of these options to change the symbol's appearance    
        let options = {
            radius: quake.properties.mag * 15000,
            fillColor: colorCircle(quake.properties.mag),
            color: colorCircle(quake.properties.mag),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
          }
        // new Date parses Epoch time from JSON into human readable date&time
        const popupMsg = "<h3>" + quake.properties.title + "<h3><h3>Date: " + new Date(quake.properties.time)+ "<h3>";
        const quakeMarkers = L.circle(coords, options).bindPopup(popupMsg);

        // Add the marker to the quakeMarkers array
        return quakeMarkers;
    })

    // Create a layer group made from the quakeMarkers array, pass it into the createMap function
    createMap(L.layerGroup(quakeMarkers));
}


// Perform an API call to the USGS earthquake API to get quake info. Call createCircleMarkers when complete
(async function(){
    const urlGeoJSON = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
    let response = await d3.json(urlGeoJSON)
    // console.log(response) For analysis in terminal
    createCircleMarkers(response)
})()

// this little function will return a color based on the earthquakes magnitude 
function colorCircle(mag) {
    let color = '';
    if (mag <= 1) {
        color = 'green';
    } else if (mag > 1 && mag <= 3) {
        color = 'yellow';
    } else if (mag > 3 && mag <= 5) {
        color = 'orange';
    } else if (mag > 5 && mag <=7) {
        color = 'red';
    } else if (mag > 7)
        color = 'grey';
    return color;
  }
