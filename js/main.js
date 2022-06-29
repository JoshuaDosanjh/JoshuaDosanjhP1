// var map = L.map('map').fitWorld()

var map = L.map('map', { layer: [OpenStreetMap_Mapnik] }).setView([0, 0], 13);

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var mapboxAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

var mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zaHVhZG9zYW5qaCIsImEiOiJjbDBjYmVmemwwNHRzM2tzNHl2MG44emh5In0.D4os8bb5qB5SncVa5_cOwA';

var streets = L.tileLayer(mapboxUrl, { id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution });

var satellite = L.tileLayer(mapboxUrl, { id: 'mapbox/satellite-streets-v11', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution });

L.easyButton('<i class="fa-solid fa-info"></i>', function (btn, map) {
	var cI = new bootstrap.Modal(document.getElementById('countryInfo'))
	cI.toggle()
}, 'Country Information').addTo(map);

L.easyButton('<i class="fa-solid fa-flag"></i>', function (btn, map) {
	var fI = new bootstrap.Modal(document.getElementById('flagInfo'))
	fI.toggle()
}, 'Country Flag').addTo(map);

L.easyButton('<i class="fa-solid fa-cloud"></i>', function (btn, map) {
	var wI = new bootstrap.Modal(document.getElementById('weatherInfo'))
	wI.toggle()
}, 'Country Weather').addTo(map);

L.easyButton('<i class="fa-solid fa-head-side-mask"></i>', function (btn, map) {
	var cvI = new bootstrap.Modal(document.getElementById('covidInfo'))
	cvI.toggle()
}, 'Coronavirus Stats').addTo(map);

L.easyButton('<i class="fa-solid fa-newspaper"></i>', function (btn, map) {
	var nI = new bootstrap.Modal(document.getElementById('newsInfo'))
	nI.toggle()
}, 'Country News').addTo(map);

let geoJSON = L.geoJSON();
let point;
let markers = L.markerClusterGroup();
let cities = L.markerClusterGroup();
let overlayPoi;
let overlayCity;

var baseMaps = {
	"OpenStreetMap": OpenStreetMap_Mapnik,
	"Streets": streets,
	"Satellite": satellite
};

var layerControl = L.control.layers(baseMaps).addTo(map);

var loader;

function load() {
	loader = document.getElementById("loader");
	document.body.removeChild(loader);
	document.getElementById('page').classList.add('ready');
};

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
			geoJSON = L.geoJSON(result.data, {
				color: 'black',
				fillColor: 'red',
				fillOpacity: 0.2,
				weight: 3
			}).addTo(map);
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
							prefix: 'fas',
							icon: 'fa-solid fa-mountain-sun',
							iconColor: 'black',
							iconRotate: 0,
							extraClasses: '',
							number: '',
							svg: true
						});

						var city = L.ExtraMarkers.icon({
							shape: 'star',
							markerColor: 'black',
							prefix: 'fas',
							icon: 'fa-solid fa-city',
							iconColor: '#fff',
							iconRotate: 0,
							extraClasses: '',
							number: '',
							svg: true
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

					overlayPoi = {
						"Points of Interest": point,
					};

					layerControl.addOverlay(markers, "Points of Interest");

				},
				error: function (xhr, status, error) {
					console.log(xhr.responseText);
				}
			})

			$.ajax({
				url: "php/City.php",
				type: 'POST',
				dataType: 'json',
				data: {
					'CoCo': $('#Countries').val()
				},
				success: function (result) {
					if (result.status.name == "ok") {

						var poi = L.ExtraMarkers.icon({
							shape: 'circle',
							markerColor: 'white',
							prefix: 'fas',
							icon: 'fa-solid fa-mountain-sun',
							iconColor: 'black',
							iconRotate: 0,
							extraClasses: '',
							number: '',
							svg: true
						});

						var city = L.ExtraMarkers.icon({
							shape: 'star',
							markerColor: 'black',
							prefix: 'fas',
							icon: 'fa-solid fa-city',
							iconColor: '#fff',
							iconRotate: 0,
							extraClasses: '',
							number: '',
							svg: true
						});

						let cam

						if (map.hasLayer(cities)) map.removeLayer(cities)
						cities = L.markerClusterGroup();
						result.data.result.webcams.forEach(result => {
                            if (result.player.live.available == true) {
								cam = `<iframe src='${result.player.live.embed}'></iframe>`;
							} else if (result.player.day.available == true) {
								cam = `<iframe src='${result.player.day.embed}'></iframe>`;
							} else if (result.player.month.available == true) {
								cam = `<iframe src='${result.player.month.embed}'></iframe>`;
							} else if (result.player.year.available == true) {
								cam = `<iframe src='${result.player.year.embed}'></iframe>`;
							} else if (result.player.lifetime.available == true) {
								cam = `<iframe src='${result.player.lifetime.embed}'></iframe>`;
							} else {
								cam = `No Avaliable Webcam`;
						    };
							cities.addLayer(L.marker([result.location.latitude, result.location.longitude], { icon: city })
								.bindPopup(`${result.location.city}<p>${cam}</p>`)
								.openPopup());
						})
						map.addLayer(cities);
					}

					overlayCity = {
						"Cities": cities
					};

					layerControl.addOverlay(cities, "Cities");

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

						let table = ""
						result.data.list.forEach(weather => {
							table += `
                            <tr>
                                <td rowspan="5">
                                    <div id="WT">Time: ${weather['dt_txt']}</div>
                                    <p id="WT">${Math.round(weather.main['temp'] - 273.15)}<sup>o</sup>C (${Math.round(weather.main['temp_min'] - 273.15)}<sup>o</sup>C - ${Math.round(weather.main['temp_max'] - 273.15) }<sup>o</sup>C)</p>
                                    <img src="https://openweathermap.org/img/wn/${weather.weather[0]["icon"]}@2x.png">
                                    <p id="WT">${weather.weather[0]['description']}</p>
                                </td>
                            </tr>
                            <tr>
                                <td><i class="fa-solid fa-wind"></i></td>
                                <td id="WT">${weather.wind['speed']}MPS</td>
                            </tr>
                            <tr>
                                <td><i class="fa-solid fa-cloud"></i></td>
                                <td id="WT">${weather.clouds['all']}%</td>
                            </tr>
                            <tr>
                                <td><i class="fa-solid fa-tornado"></i></td>
                                <td id="WT">${weather.main['pressure']}hPa</td>
                            </tr>
                            <tr>
                                <td><i class="fa-solid fa-sun"></i></td>
                                <td id="WT">${weather.main['humidity']}%</td>
                            </tr>
                            `
						})
						$('#Weather').html(table);

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
					var CA = result['data']["area_size"]
					var Pop = result['data']["population"]
					$('#CA').html(CA.toLocaleString({ minimumFractionDigits: 2 }));
					$('#Pop').html(Pop.toLocaleString({ minimumFractionDigits: 2 }));
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
				url: "php/Corona.php",
				type: 'POST',
				dataType: 'json',
				data: {
					'CC': $('#Countries').val()
				},
				success: function (result) {
					var TCC = result['data'].stats["totalConfirmedCases"]
					var NCC = result['data'].stats["newlyConfirmedCases"]
					var TD = result['data'].stats["totalDeaths"]
					var ND = result['data'].stats["newDeaths"]
					var TRC = result['data'].stats["totalRecoveredCases"]
					var NRC = result['data'].stats["newlyRecoveredCases"]
					$('#TCC').html(TCC.toLocaleString({ minimumFractionDigits: 2 }));
					$('#NCC').html(NCC.toLocaleString({ minimumFractionDigits: 2 }));
					$('#TD').html(TD.toLocaleString({ minimumFractionDigits: 2 }));
					$('#ND').html(ND.toLocaleString({ minimumFractionDigits: 2 }));
					$('#TRC').html(TRC.toLocaleString({ minimumFractionDigits: 2 }));
					$("#NRC").html(NRC.toLocaleString({ minimumFractionDigits: 2 }));
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

