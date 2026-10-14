<?php
header("Content-Type: application/json; charset=UTF-8");

$envCandidates = [
    __DIR__ . '/.env',
    dirname(__DIR__) . '/.env',
    dirname(__DIR__, 2) . '/.env',
    '/home4/lucidmindco/.env',
    '/home4/lucidmindco/public_html/.env',
    '/home4/lucidmindco/public_html/api/.env'
];

$loadedEnvPath = null;
foreach ($envCandidates as $envFile) {
    if (file_exists($envFile)) {
        $loadedEnvPath = $envFile;
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if (strpos($line, '#') === 0 || empty($line) || strpos($line, '=') === false) continue;
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value, " \t\n\r\0\x0B\"'");
            putenv("$name=$value");
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
        break;
    }
}

$getEnvVar = function($key) {
    $val = getenv($key);
    if ($val !== false && $val !== null && $val !== '') return $val;
    if (isset($_ENV[$key]) && $_ENV[$key] !== '') return $_ENV[$key];
    if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') return $_SERVER[$key];
    return '';
};

$smtpHost       = $getEnvVar('SMTP_HOST') ?: 'smtp.gmail.com';
$smtpPort       = (int)($getEnvVar('SMTP_PORT') ?: 465);
$smtpEncryption = strtolower($getEnvVar('SMTP_ENCRYPTION') ?: 'ssl');
$smtpUser       = $getEnvVar('SMTP_USER');
$smtpPassword   = $getEnvVar('SMTP_APP_PASSWORD') ?: $getEnvVar('SMTP_PASSWORD');
$receiverEmail  = $getEnvVar('RECEIVER_EMAIL');

$cleanPassword = str_replace(' ', '', $smtpPassword);

$diagnostics = [
    'env_loaded_from' => $loadedEnvPath,
    'openssl_loaded'  => extension_loaded('openssl'),
    'smtp_host'       => $smtpHost,
    'smtp_port'       => $smtpPort,
    'smtp_encryption' => $smtpEncryption,
    'smtp_user_set'   => !empty($smtpUser),
    'smtp_user'       => $smtpUser,
    'receiver_set'    => !empty($receiverEmail),
    'receiver_email'  => $receiverEmail,
    'password_set'    => !empty($cleanPassword),
    'password_length' => strlen($cleanPassword),
    'is_placeholder_password' => ($cleanPassword === 'YOUR_NEW_SMTP_APP_PASSWORD'),
];

// Test socket connectivity
$errno = 0;
$errstr = '';
$socket465 = @fsockopen("ssl://smtp.gmail.com", 465, $errno, $errstr, 5);
$diagnostics['port_465_ssl_connect'] = ($socket465 !== false);
if ($socket465) { fclose($socket465); } else { $diagnostics['port_465_error'] = "$errno: $errstr"; }

$socket587 = @fsockopen("smtp.gmail.com", 587, $errno, $errstr, 5);
$diagnostics['port_587_tcp_connect'] = ($socket587 !== false);
if ($socket587) { fclose($socket587); } else { $diagnostics['port_587_error'] = "$errno: $errstr"; }

// Test PHPMailer connection if vendor exists
$vendorPath = __DIR__ . '/vendor/phpmailer/PHPMailer.php';
$diagnostics['phpmailer_vendor_exists'] = file_exists($vendorPath);

if ($diagnostics['phpmailer_vendor_exists'] && !empty($smtpUser) && !empty($cleanPassword)) {
    require_once __DIR__ . '/vendor/phpmailer/Exception.php';
    require_once __DIR__ . '/vendor/phpmailer/PHPMailer.php';
    require_once __DIR__ . '/vendor/phpmailer/SMTP.php';

    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host       = $smtpHost;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtpUser;
        $mail->Password   = $cleanPassword;
        $mail->SMTPSecure = ($smtpEncryption === 'tls' || $smtpPort === 587) ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = $smtpPort;
        $mail->Timeout    = 10;

        $connected = $mail->smtpConnect();
        $diagnostics['phpmailer_smtp_connect'] = $connected;
        if ($connected) {
            $mail->smtpClose();
        }
    } catch (\Exception $e) {
        $diagnostics['phpmailer_smtp_connect'] = false;
        $diagnostics['phpmailer_error'] = $mail->ErrorInfo ?: $e->getMessage();
    }
}

echo json_encode($diagnostics, JSON_PRETTY_PRINT);
