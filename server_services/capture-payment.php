<?php

// Import file
require_once("functions.php");

// get params

$orderID = $_GET["orderId"];
$amount_to_capt = $_GET["amount"];
$currency = 'USD';
$final_capt = 'false';

// get access token using get_access_token() function in functions.php
$access_token = get_access_token();

// get payment response by executing create_payment() function declared in functions.php
$response = capture_payment( $access_token, $orderID, $amount_to_capt, $currency, $final_capt );

header('Content-Type: application/json');
echo $response;


?>