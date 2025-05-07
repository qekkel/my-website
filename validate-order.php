<?php
header("Access-Control-Allow-Origin: https://app.snipcart.com");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// 1. Get Snipcart request
$request = json_decode(file_get_contents('php://input'), true);

// 2. Verify your Snipcart API Key
$apiKey = 'YOUR_SECRET_API_KEY'; // From Snipcart Dashboard > Credentials

// 3. Simple validation example
$isValid = true;
$errors = [];

// Check product availability
foreach ($request['items'] as $item) {
    if ($item['id'] === 'twins-painting' && $item['quantity'] > 5) {
        $isValid = false;
        $errors[] = "Maximum 5 units allowed for 'Painting Twins'";
    }
}

// 4. Return response
echo json_encode([
    'success' => $isValid,
    'errors' => $errors
]);
?>