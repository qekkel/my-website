<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Для тестов

// Настройки SMTP (замените на свои)
define('SMTP_HOST', 'smtp.gmail.com'); // Для Gmail
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'qekkel.olia@gmail.com'); // Ваш Gmail
define('SMTP_PASSWORD', 'ваш_пароль_приложения'); // Пароль приложения Gmail
define('MAIL_FROM', SMTP_USERNAME); // Должен быть вашей Gmail-почтой
define('MAIL_FROM_NAME', 'Qekkel Website');
define('MAIL_TO', 'qekkel.olia@gmail.com'); // Ваша почта для получения писем

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Проверка на бота
    if (!empty($_POST['website'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Bot detected']);
        exit;
    }

    // Проверка времени заполнения (>5 секунд)
    if (isset($_POST['timestamp']) && (time() - (int)$_POST['timestamp'] < 5)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Error sending message']);
        exit;
    }

    // Очистка данных
    $name = filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL); // Используйте валидацию
    $message = filter_var(trim($_POST['message']), FILTER_SANITIZE_STRING);

    // Валидация
    if (empty($firstName) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Все поля обязательны']);
        exit;
    }

    if (!$email) { // Проверка результата валидации email
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Неверный формат email']);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // Настройки сервера
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;
        $mail->CharSet = 'UTF-8';

        // Отправитель и получатель
        $mail->setFrom(SMTP_USERNAME, MAIL_FROM_NAME); // Используйте SMTP_USERNAME как from
        $mail->addAddress(MAIL_TO, 'Olga Qekkel');
        $mail->addReplyTo($email, $firstName . ' ' . $lastName);

        // Содержимое письма
        $mail->isHTML(false); // Отправляйте как текст, а не HTML
        $mail->Subject = 'Новое сообщение от ' . $firstName . ' ' . $lastName;
        $mail->Body = "Имя: $firstName $lastName\nEmail: $email\nСообщение:\n$message";

        // Отправка
        $mail->send();

        // Логирование
        error_log("Email sent to $email at " . date('Y-m-d H:i:s'), 3, "mail_log.log");
        echo json_encode(['success' => true, 'message' => 'Сообщение отправлено!']);
    } catch (Exception $e) {
        error_log("Mailer Error: " . $mail->ErrorInfo . " at " . date('Y-m-d H:i:s'), 3, "mail_errors.log");
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Ошибка при отправке',
            'debug' => $mail->ErrorInfo // Уберите это в продакшене
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не разрешен']);
}
?>

<?php 