<?php
// Load env
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        putenv(trim($name) . '=' . trim($value));
    }
}

require_once __DIR__ . '/backend/vendor/phpmailer/Exception.php';
require_once __DIR__ . '/backend/vendor/phpmailer/PHPMailer.php';
require_once __DIR__ . '/backend/vendor/phpmailer/SMTP.php';

try {
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mail->SMTPDebug = 2; // Enable verbose debug output
    $mail->Debugoutput = 'html';
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = getenv('SMTP_USER');
    $mail->Password   = str_replace(' ', '', getenv('SMTP_APP_PASSWORD'));
    $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom(getenv('SMTP_USER'), 'Test Script');
    $mail->addAddress(getenv('SMTP_USER'));

    $mail->isHTML(false);
    $mail->Subject = 'Test Subject';
    $mail->Body    = 'This is the plain text message body';

    $mail->send();
    echo "Message has been sent successfully\n";
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}\n";
}
