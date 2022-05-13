<?php

ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://opentripmap-places-v1.p.rapidapi.com/en/places/radius?radius=100000&lon=" . $_REQUEST['LNG'] . "&lat=" . $_REQUEST['LAT'],
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"X-RapidAPI-Host: opentripmap-places-v1.p.rapidapi.com",
		"X-RapidAPI-Key: edd27d4269mshd1b61f37c385221p167084jsn1308fdb263a3"
	],
]);

$result = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

?>
