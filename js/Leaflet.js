// var map = L.map('map').fitWorld()

 var map = L.map('map').setView([0, 0], 13);

// map.locate({ setView: true, maxZoom: 16 });

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.easyButton('&ImaginaryI;', function (btn, map) {
	var cI = new bootstrap.Modal(document.getElementById('countryInfo'))
	cI.toggle()
}, 'Country Information').addTo(map);

L.easyButton('&EmptySmallSquare;', function (btn, map) {
	var fI = new bootstrap.Modal(document.getElementById('flagInfo'))
	fI.toggle()
}, 'Country Flag').addTo(map);

L.easyButton('&profsurf;', function (btn, map) {
	var wI = new bootstrap.Modal(document.getElementById('weatherInfo'))
	wI.toggle()
}, 'Country Weather').addTo(map);

L.easyButton('&star;', function (btn, map) {
	var nI = new bootstrap.Modal(document.getElementById('newsInfo'))
	nI.toggle()
}, 'Country News').addTo(map);

let geoJSON;
let point;
let markers;

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
				$('#Countries').val(result.data.results[0].components['ISO_3166-1_alpha-2']).trigger('change');

			}

		},
	})



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
			if (map.hasLayer(geoJSON)) map.removeLayer(geoJSON)
			geoJSON = L.geoJSON(result.data).addTo(map);
			map.fitBounds(geoJSON.getBounds());

			var LowVal = $('#Countries').val().toLowerCase();
			if (LowVal == "gb") {
					LowVal = "uk";
			};
                
			$.ajax({
				url: "php/Poi.php",
				type: 'POST',
				dataType: 'json',
				data: {
					'Cc': LowVal
				},
				success: function (result) {
					if (result.status.name == "ok") {

						var poi = L.ExtraMarkers.icon({
							shape: 'circle',
							markerColor: 'white',
							prefix: '',
							icon: 'fa-number',
							iconColor: '#fff',
							iconRotate: 0,
							extraClasses: '',
							number: '1',
							svg: false
						});



						if (map.hasLayer(markers)) map.removeLayer(markers)
						markers = L.markerClusterGroup();
						result.data.results.forEach(result => {

							markers.addLayer(L.marker([result.coordinates.latitude, result.coordinates.longitude], { icon: poi })
								.bindPopup(result.name)
								.openPopup());
						})
						map.addLayer(markers);
					}

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
						$('#WI').html(result['data'].weather[0]['main']);
						$('#WindSpeed').html(result['data'].wind['speed']);
						$('#WindDeg').html(result['data'].wind['deg']);
						$('#WindGust').html(result['data'].wind['gust']);
						$('#Cloud').html(result['data'].clouds['all']);
						$('#Temp').html(result['data'].main['temp']);
						$('#MaxTemp').html(result['data'].main['temp_max']);
						$('#Pressure').html(result['data'].main['pressure']);
						$('#Humidity').html(result['data'].main['humidity']);
						$('#MinTemp').html(result['data'].main['temp_min']);
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
			
			$.ajax({
				url: "php/News.php",
				type: 'POST',
				dataType: 'json',
				data: {
				    'cCode': $('#Countries').val()
				},
				success: function (result) {

					let html = ""
					result.data.articles.forEach(article => {
						html += `
                        <div class="article">
                            <h5>${article.title}</h5>
                            <div>
                                <img class="img-fluid" src="${article.urlToImage || ''}" />
                            </div>
                        </div>
                        `
					})
					document.querySelector("#newsInfo .modal-content .modal-body").innerHTML = html
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
	},
});

