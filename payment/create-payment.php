<?php
header('Content-Type: application/json');

// Placeholder keys - replace with your real Razorpay Key ID & Secret in production
$KEY_ID = getenv('RAZORPAY_KEY_ID') ?: 'RAZORPAY_KEY_ID';
$KEY_SECRET = getenv('RAZORPAY_KEY_SECRET') ?: 'RAZORPAY_KEY_SECRET';

$input = json_decode(file_get_contents('php://input'), true);
$amount = isset($input['amount']) ? intval($input['amount']) : 100; // amount in rupees default 100
$description = isset($input['description']) ? $input['description'] : 'Payment Link';
$customer = isset($input['customer']) ? $input['customer'] : null;

// Razorpay Payment Links API - create link
$payload = array(
    "amount" => $amount * 100, // in paise
    "currency" => "INR",
    "accept_partial" => false,
    "description" => $description,
    "reference_id" => "REF_" . time(),
    "customer" => $customer ? $customer : array("name"=>"Guest","contact"=>"","email"=>""),
    "notify" => array("sms"=>true, "email"=>true),
    "reminder_enable" => true
);

$ch = curl_init('https://api.razorpay.com/v1/payment_links');
curl_setopt($ch, CURLOPT_USERPWD, $KEY_ID . ':' . $KEY_SECRET);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

$result = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if(curl_errno($ch)){
    echo json_encode(["error" => curl_error($ch)]);
    exit;
}
curl_close($ch);

http_response_code($httpcode);
echo $result;
?>