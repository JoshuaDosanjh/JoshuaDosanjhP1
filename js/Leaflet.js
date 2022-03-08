// var map = L.map('map').fitWorld()

var map = L.map('map').setView([51.505, -0.09], 13);

// map.locate({ setView: true, maxZoom: 16 });

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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

$('#Sub').click(function () {

	$.ajax({
		url: "CountryList.php",
		type: 'POST',
		dataType: 'json',
		data: {
			countryBorders: $('#Countries').val()
		},
		success: function (result) {

			console.log(JSON.stringify(result));

			if (result.status.name == "ok") {

				$('#Name').html(result['data'][0]['name']);
				$('#Pop').html(result['data'][0]['population']);
				$('#Cur').html(result['data'][0]['currency']);
				$('#CW').html(result['data'][0]['weather']);
				$('#WL').html(result['data'][0]['wiki_url']);

			}

		},

	});

});
