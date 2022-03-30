<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$result = file_get_contents("countryBorders.geo.json");
    
	$decode = json_decode($result, true);	

	$polybord = [];

    if($decode['features']["properties"]["iso_a2"] == $_REQUEST['ISO']){

        foreach($decode['features'] as $border_data){

            array_push(

                $polybord,

                array(

                    "coordinates"=> $border_data['geometry']["coordinates"],

                )

            );
		};
    }

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>