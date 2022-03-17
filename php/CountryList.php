<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$result = file_get_contents("countryBorders.geo.json");
    
	$decode = json_decode($result, true);	

	$country = [];

    foreach($decode['features'] as $country_data){

        array_push(

            $country,

            array(

                "name"=> $country_data["properties"]["name"],

                "iso_a2"=> $country_data["properties"]["iso_a2"],

                "iso_a3"=> $country_data["properties"]["iso_a3"],

            )

        );
    }



	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $country;

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>