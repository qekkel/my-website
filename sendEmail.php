<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $firstName = $_POST['first-name'];
  $lastName = $_POST['last-name'];
  $email = $_POST['email'];
  $message = $_POST['message'];

  // Формирование письма
  $to = "qekkel.olia@gmail.com";
  $subject = "New Contact Form Message";
  $body = "First Name: $firstName\nLast Name: $lastName\nEmail: $email\nMessage: $message";
  $headers = "From: $email";

  // Отправка письма
  if (mail($to, $subject, $body, $headers)) {
    echo "Message sent successfully!";
  } else {
    echo "Failed to send message.";
  }
}
?>s