var map = L.map('map').fitWorld()
map.locate({ setView: true, maxZoom: 16 });

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/1/1/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function onLocationFound(e) {
	var radius = e.accuracy;

	L.marker(e.latlng).addTo(map)
		.bindPopup("You are within " + radius + " meters from this point").openPopup();

	L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
	alert(e.message);
}

map.on('locationerror', onLocationError);

var latlngs = [
	$("polyboard")["coordinates"]
];

var polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);
map.fitBounds(polyline.getBounds());
