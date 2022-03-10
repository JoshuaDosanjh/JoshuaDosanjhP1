// var map = L.map('map').fitWorld()

var map = L.map('map').setView([51.505, -0.09], 13);

// map.locate({ setView: true, maxZoom: 16 });

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function success(pos) {
	var crd = pos.coords;

	console.log('Your current position is:');
	console.log(`Latitude : ${crd.latitude}`);
	console.log(`Longitude: ${crd.longitude}`);
	console.log(`More or less ${crd.accuracy} meters.`);
}

navigator.geolocation.getCurrentPosition(success);

function onLocationFound() {

	var latlngs = [
		$("locate")["coordinates"]
	];

};

var latlngs = [
	$("polyboard")["coordinates"]
];

var polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);
map.fitBounds(polyline.getBounds());
