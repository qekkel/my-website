<?php
header("Access-Control-Allow-Origin: https://app.snipcart.com");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// 1. Получаем секретный ключ из переменных окружения
$apiKey = getenv('ZWQxMmRkOTUtMWJiYy00Zjk2LWIwZTUtOTdlOTc5Mzg0ZjVhNjM4ODE5NjM1Mzk2NjQwNjA2');

// 2. Проверяем подпись запроса
if (!hash_equals($apiKey, $_SERVER['HTTP_X_SNIPCART_REQUESTTOKEN'] ?? '')) {
    http_response_code(401);
    die(json_encode(['errors' => ['Invalid API key']]));
}

// 3. Получаем данные заказа
$request = json_decode(file_get_contents('php://input'), true);

// 4. Валидация
$response = [
    'success' => true,
    'errors' => []
];

foreach ($request['items'] as $item) {
    // Проверка максимального количества
    if ($item['id'] === 'twins-painting' && $item['quantity'] > 5) {
        $response['success'] = false;
        $response['errors'][] = "Maximum 5 units allowed for 'Painting Twins'";
    }
    
    // Проверка выбора рамки
    if ($item['id'] === 'twins-painting' && empty($item['customFields']['Frame Color'])) {
        $response['success'] = false;
        $response['errors'][] = "Please select frame color for 'Painting Twins'";
    }
}

echo json_encode($response);
?>