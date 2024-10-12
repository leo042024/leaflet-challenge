// Creating the map object
var map = L.map('map').setView([10, -30], 3);
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson';

// Adding the tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const init = async () => {
    data = await d3.json(url);

    L.geoJSON(data, {
        style: function (feature) {
            let mag = feature.properties.mag;
            let depth = feature.geometry.coordinates[2];
            return {
                color: 'grey',
                fillOpacity: .6,
                fillColor: 
                    depth < 10 ? 'green' : 
                    depth < 30 ? 'lime' : 
                    depth < 50 ? 'yellow' : 
                    depth < 70 ? 'orange' :
                    depth < 90 ? 'darkorange' : 'red',
                weight: 1,
                radius: mag * 3
            };
        },
        pointToLayer: (data, latlng) => L.circleMarker(latlng)
    }).bindPopup(function (layer) {
        let mag = layer.feature.properties.mag;
        let place = layer.feature.properties.place;
        let time = new Date(layer.feature.properties.time).toLocaleString();

        return `<h4>${place}<br>Magnitude: ${mag}<br>${time}</h4>`;
    }).addTo(map);

    // Set up the legend
    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let depths = [0, 10, 30, 50, 70, 90];
        let colors = ['green', 'lime', 'yellow', 'orange', 'darkorange', 'red'];
        let labels = [];

        // Add the minimum and maximum.
        let legendInfo = "<h4>Earthquake Depth (km)</h4>" +
            "<div class=\"labels\">" +
            "<div class=\"min\">" + depths[0] + "</div>" +
            "<div class=\"max\">" + depths[depths.length - 1] + "</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        depths.forEach(function(depth, index) {
            labels.push(
                "<li style=\"background-color: " + colors[index] + "\"></li> " +
                depth + (depths[index + 1] ? "&ndash;" + depths[index + 1] : "+"));
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Adding the legend to the map
    legend.addTo(map);
};

init();

