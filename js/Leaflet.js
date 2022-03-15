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

};

navigator.geolocation.getCurrentPosition(success);

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function (position) {
		$.ajax({
			url: "OpenCage.php",
			type: 'POST',
			dataType: 'json',
			data: {
				x: position.coords.latitude,
				y: position.coords.longitude
			},
			success: function displayVals() {
				var Country = $("#Countries").val("ISO_2");
				$("#1").html(Country)
				}
			})
		})
	})
};


$("select").change(displayVals);
displayVals();

(function onLocationFound() {

	$.ajax({
		url: "OpenCage.php",
		type: 'POST',
		dataType: 'json',
		data: {
			countryCode: $('#Countries').val()
		},
		success: function (result) {

			console.log(JSON.stringify(result));

			select.addEventListener('change', function () {
				name.textContent = this.value;
			});

		},

	}); 

});

var latlngs = [
	$("polyboard")["coordinates"]
];

var polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);
map.fitBounds(polyline.getBounds());

