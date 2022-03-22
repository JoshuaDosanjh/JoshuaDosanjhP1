// var map = L.map('map').fitWorld()

var map = L.map('map').setView([51.505, -0.09], 13);

// map.locate({ setView: true, maxZoom: 16 });

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function success(pos) {

	$.ajax({
		url: "php/OpenCage.php",
		type: 'POST',
		dataType: 'json',
		data: {
			'LAT': pos.coords.latitude,
			'LNG': pos.coords.longitude
		},
		success: function (result) {
			if (result.status.name == "ok") {
				$('#Countries').val(result.data.results[0].components['ISO_3166-1_alpha-2']);
			}
			
		},
	})

};
/*
	$.ajax({
		url: "php/Weather.php",
		type: 'POST',
		dataType: 'json',
		data: {
			'LAT': latitude,
			'LNG': longitude
		},
		success: function (result) {
			if (result.status.name == "ok") {
				$('#CW').html(result.data[0].weather['description']);
			}
		},
	})
*/
$('#Countries').change(function () {

	$.ajax({
		url: "php/CountryAPI.php",
		type: 'POST',
		dataType: 'json',
		data: {
			'Ccode': $('#Countries').val()
		},
		success: function (result) {
				$('#Pop').html(result.data.results[0]["population"]);
				$('#Cur').html(result.data.results[0].currency['name']);
				$('#WL').html(result.data.results[0]['wiki_url']);
		},
		error: function (xhr, status, error) {
			console.log(xhr.responseText);
		}
	})
});

/*
function success(pos) {

	$.ajax({
		url: "php/CountryAPI.php",
		type: 'POST',
		dataType: 'json',
		data: {
			'Ccode': $('#Countries').val()
		},
		success: function (result) {
			if (result.status.name == "ok") {
				$('#Pop').html(result.data.results[0]["population"]);
				$('#Cur').html(result.data.results[0].currency['name']);
				$('#WL').html(result.data.results[0]['wiki_url']);
			}
		},
	})

};
$('#Name').html(result.data.results[0].components['country']);
function success(pos) {

	$.ajax({
		url: "php/Weather.php",
		type: 'POST',
		dataType: 'json',
		data: {
			'LAT': pos.coords.latitude,
			'LNG': pos.coords.longitude
		},
		success: function (result) {
			if (result.status.name == "ok") {
				$('#CW').html(result.data[0].weather['description']);
			}
		},
	})

};
*/
navigator.geolocation.getCurrentPosition(success);

$.ajax({
	url: 'php/CountryList.php',
	success: result => {
		let html = ''
		result.data.forEach(country => {
			html += `<option value='${country.iso_a2}'>${country.name}</option>`
		});
		$('#Countries').html(html);
	}
})

var latlngs = [
	$("polyboard")["coordinates"]
];


