// var map = L.map('map').fitWorld()

 var map = L.map('map').setView([0, 0], 13);

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

	map.panTo(new L.LatLng(pos.coords.latitude, pos.coords.longitude));

};

navigator.geolocation.getCurrentPosition(success);

$('#Countries').change(function () {

	$.ajax({
		url: "php/CountryList2.php",
		type: 'POST',
		dataType: 'json',
		data: {
			'ISO': $('#Countries').val()
		},
		success: function (result) {
			L.geoJSON(result.data).addTo(map);
		},
		error: function (xhr, status, error) {
			console.log(xhr.responseText);
		}
	})

	$.ajax({
		url: "php/RestAPI.php",
		type: 'POST',
		dataType: 'json',
		data: {
			'code': $('#Countries').val()
		},
		success: function (result) {
			latitude = result['data'].latlng[0];
			longitude = result['data'].latlng[1];

			map.panTo(new L.LatLng(latitude, longitude));

			$.ajax({
				url: "php/OpenCage.php",
				type: 'POST',
				dataType: 'json',
				data: {
					'LAT': latitude,
					'LNG': longitude
				},
				success: function (result) {
					if (result.status.name == "ok") {
						$('#Name').html(result.data.results[0].components['country']);
					}

				},
				error: function (xhr, status, error) {
					console.log(xhr.responseText);
				}
			})

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
						$('#CW').html(result['data'].weather[0]['description']);
					}
				},
				error: function (xhr, status, error) {
					console.log(xhr.responseText);
				}
			})

			$.ajax({
				url: "php/CountryAPI.php",
				type: 'POST',
				dataType: 'json',
				data: {
					'Ccode': $('#Countries').val()
				},
				success: function (result) {
					$('#CA').html(result['data']["area_size"]);
					$('#Pop').html(result['data']["population"]);
					$('#Cap').html(result['data'].capital['name']);
					$('#Cur').html(result['data'].currency['name']);
					$('#PC').html(result['data']["phone_code"]);
					$('#WL').html(result['data']['wiki_url']);
					$("#flagImage").attr("src", result['data'].flag['file']);
				},
				error: function (xhr, status, error) {
					console.log(xhr.responseText);
				}
			})
		},
		error: function (xhr, status, error) {
			console.log(xhr.responseText);
		}
	})
});

$.ajax({
	url: 'php/CountryList.php',
	success: result => {
		let html = ''
		result.data.forEach(country => {
			html += `<option value='${country.iso_a2}'>${country.name}</option>`
		});
		$('#Countries').html(html);
	}
});

