<?php
/*
ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://bing-news-search1.p.rapidapi.com/news?cc=" . $_REQUEST['cCode'] . "&textFormat=Html&safeSearch=Moderate",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"X-BingApis-SDK: true",
		"X-RapidAPI-Host: bing-news-search1.p.rapidapi.com",
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
*/

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url = 'https://newsapi.org/v2/top-headlines?country=' . $_REQUEST['cCode'] . '&apiKey=ac7fbc9d08b44c25a1b9688d70bfbecd';
	
	$userAgent = $_SERVER['HTTP_USER_AGENT'];
	

	$ch = curl_init();
    curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
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
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);
?>
