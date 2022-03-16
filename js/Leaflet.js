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

function getCurrentPosition() {
			$.ajax({
				url: "php/OpenCage.php",
				type: 'POST',
				dataType: 'json',
				data: {
					'LAT': pos.coords.latitude,
					'LNG': pos.coords.longitude
				},
				success: function (result) {

					console.log(JSON.stringify(result));

					if (result.status.name == "ok") {

						$('#Countries').html(result['data'][0]['country']);

					}
				}
			})
};


(function onLocationFound() {

	$.ajax({
		url: "php/OpenCage.php",
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


