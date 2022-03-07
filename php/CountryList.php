<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$result = file_get_contents("countryBorders.geo.json");
    
	$decode = json_decode($result, true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode["features"];

	$country = []

    foreach($decoded_object['features'] as $country_data){

        array_push(

            $country,

            array(

                "name"=> $country_data["properties"]["name"],

                "iso_a2"=> $country_data["properties"]["iso_a2"],

                "iso_a3"=> $country_data["properties"]["iso_a3"],

            )

        );

	$border = []

    if($features['properties']["iso_a2"] == $_REQUEST['iso_code'] ){

        array_push(

            $border,

            array(

                $decoded_object['features']

            )

        );
	
    $polybord = []

    foreach($decoded_object['geometry'] as $border_data){

        array_push(

            $polybord,

            array(

                "coordinates"=> $border_data["coordinates"],

            )

        );

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

    $curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://countries-cities.p.rapidapi.com/location/country/" . $_REQUEST['%7Bcode%7D'],
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"x-rapidapi-host: countries-cities.p.rapidapi.com",
		"x-rapidapi-key: edd27d4269mshd1b61f37c385221p167084jsn1308fdb263a3"
	],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
	echo "cURL Error #:" . $err;
} else {
	echo $response;
}

ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url='api.openweathermap.org/data/2.5/weather?q=' . $_REQUEST['q'] '&appid=785004996c8a3da899fd532d5efc64e3';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode['isocode'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?>