<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class ContactController
{
    public function handleRequest($method, $args)
    {
        header('Content-Type: application/json; charset=utf-8');

        if ($method === 'POST') {
            $this->sendEmail();
            return;
        }

        http_response_code(404);

        echo json_encode([
            'success' => false,
            'message' => 'Route not found'
        ]);
    }

    private function sendEmail()
    {
        // ---------------------------------------------------------
        // 1. Read JSON request
        // ---------------------------------------------------------

        $rawInput = file_get_contents('php://input');

        if (!$rawInput) {
            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'Request body is empty.'
            ]);

            return;
        }

        $data = json_decode($rawInput, true);

        if (!is_array($data)) {
            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'Invalid JSON payload received.'
            ]);

            return;
        }

        // ---------------------------------------------------------
        // 2. Get form data
        // ---------------------------------------------------------

        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $subject = trim($data['subject'] ?? '');
        $message = trim($data['message'] ?? '');

        // ---------------------------------------------------------
        // 3. Validate header injection
        // ---------------------------------------------------------

        if (
            preg_match('/[\r\n]/', $name) ||
            preg_match('/[\r\n]/', $email) ||
            preg_match('/[\r\n]/', $subject)
        ) {
            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'Invalid characters detected.'
            ]);

            return;
        }

        // ---------------------------------------------------------
        // 4. Validate required fields
        // ---------------------------------------------------------

        if (
            empty($name) ||
            empty($email) ||
            empty($subject) ||
            empty($message)
        ) {
            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'Name, email, subject and message are required.'
            ]);

            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'Please provide a valid email address.'
            ]);

            return;
        }

        // ---------------------------------------------------------
        // 5. Environment variable helper
        // ---------------------------------------------------------

        $getEnvVar = function ($key) {

            // getenv()
            $value = getenv($key);

            if ($value !== false && trim($value) !== '') {
                return trim($value);
            }

            // $_ENV
            if (isset($_ENV[$key]) && trim($_ENV[$key]) !== '') {
                return trim($_ENV[$key]);
            }

            // $_SERVER
            if (isset($_SERVER[$key]) && trim($_SERVER[$key]) !== '') {
                return trim($_SERVER[$key]);
            }

            return '';
        };

        // ---------------------------------------------------------
        // 6. SMTP configuration
        // ---------------------------------------------------------

        $smtpHost = $getEnvVar('SMTP_HOST');

        if ($smtpHost === '') {
            $smtpHost = 'smtp.gmail.com';
        }

        $smtpPort = (int)($getEnvVar('SMTP_PORT') ?: 465);

        $smtpEncryption = strtolower(
            $getEnvVar('SMTP_ENCRYPTION') ?: 'ssl'
        );

        $smtpUser = $getEnvVar('SMTP_USER');

        $smtpPassword = $getEnvVar('SMTP_APP_PASSWORD');

        if ($smtpPassword === '') {
            $smtpPassword = $getEnvVar('SMTP_PASSWORD');
        }

        // ---------------------------------------------------------
        // IMPORTANT:
        // Multiple email addresses separated by comma
        // ---------------------------------------------------------

        $receiverEmail = $getEnvVar('RECEIVER_EMAIL');

        // ---------------------------------------------------------
        // 7. Check SMTP configuration
        // ---------------------------------------------------------

        if (
            empty($smtpUser) ||
            empty($smtpPassword) ||
            empty($receiverEmail)
        ) {

            error_log(
                'LucidMind SMTP configuration error. ' .
                'SMTP_USER=' . ($smtpUser ? 'SET' : 'MISSING') . ' | ' .
                'SMTP_PASSWORD=' . ($smtpPassword ? 'SET' : 'MISSING') . ' | ' .
                'RECEIVER_EMAIL=' . ($receiverEmail ? 'SET' : 'MISSING')
            );

            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Email service is not configured correctly.'
            ]);

            return;
        }

        // Remove spaces from Gmail App Password
        $smtpPassword = str_replace(' ', '', $smtpPassword);

        // ---------------------------------------------------------
        // 8. Convert receiver string into array
        // ---------------------------------------------------------

        $receivers = explode(',', $receiverEmail);

        $validReceivers = [];

        foreach ($receivers as $receiver) {

            $receiver = trim($receiver);

            if (
                !empty($receiver) &&
                filter_var($receiver, FILTER_VALIDATE_EMAIL)
            ) {
                $validReceivers[] = $receiver;
            }
        }

        // Remove duplicates
        $validReceivers = array_unique($validReceivers);

        // ---------------------------------------------------------
        // 9. Check recipients
        // ---------------------------------------------------------

        if (empty($validReceivers)) {

            error_log(
                'LucidMind SMTP error: No valid receiver emails. ' .
                'RECEIVER_EMAIL=' . $receiverEmail
            );

            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'No valid recipient email configured.'
            ]);

            return;
        }

        // ---------------------------------------------------------
        // 10. Escape HTML
        // ---------------------------------------------------------

        $safeName = htmlspecialchars(
            $name,
            ENT_QUOTES | ENT_SUBSTITUTE,
            'UTF-8'
        );

        $safeEmail = htmlspecialchars(
            $email,
            ENT_QUOTES | ENT_SUBSTITUTE,
            'UTF-8'
        );

        $safeSubject = htmlspecialchars(
            $subject,
            ENT_QUOTES | ENT_SUBSTITUTE,
            'UTF-8'
        );

        $safeMessage = nl2br(
            htmlspecialchars(
                $message,
                ENT_QUOTES | ENT_SUBSTITUTE,
                'UTF-8'
            )
        );

        // ---------------------------------------------------------
        // 11. HTML email
        // ---------------------------------------------------------

        $htmlContent = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>New Contact Form Submission</title>

            <style>
                body {
                    font-family: Arial, Helvetica, sans-serif;
                    background-color: #f4f7f6;
                    margin: 0;
                    padding: 20px;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }

                .header {
                    background: #000000;
                    padding: 25px;
                    text-align: center;
                }

                .header img {
                    max-width: 200px;
                    max-height: 120px;
                    height: auto;
                }

                .content {
                    padding: 30px;
                    color: #333333;
                }

                .content h2 {
                    margin-top: 0;
                    color: #1a1a1a;
                    font-size: 20px;
                    margin-bottom: 25px;
                    border-bottom: 1px solid #eeeeee;
                    padding-bottom: 15px;
                }

                .field {
                    margin-bottom: 20px;
                }

                .field-label {
                    font-size: 12px;
                    text-transform: uppercase;
                    color: #888888;
                    letter-spacing: 1px;
                    margin-bottom: 6px;
                }

                .field-value {
                    font-size: 16px;
                    background: #f9f9f9;
                    padding: 12px 15px;
                    border-left: 3px solid #000000;
                    border-radius: 4px;
                    word-break: break-word;
                }

                .message-box {
                    background: #f9f9f9;
                    padding: 15px;
                    border-radius: 4px;
                    border: 1px solid #eeeeee;
                    font-size: 15px;
                    line-height: 1.6;
                    word-break: break-word;
                }

                .footer {
                    background: #f9f9f9;
                    padding: 15px;
                    text-align: center;
                    font-size: 12px;
                    color: #aaaaaa;
                    border-top: 1px solid #eeeeee;
                }

                a {
                    color: #000000;
                }
            </style>
        </head>

        <body>

            <div class='container'>

                <div class='header'>

                    <img
                        src='https://lucidmind.co.in/assets/logo/LucidMind%20logo%202.svg'
                        alt='LucidMind Logo'
                    >

                </div>

                <div class='content'>

                    <h2>New Contact Submission</h2>

                    <div class='field'>
                        <div class='field-label'>Name</div>
                        <div class='field-value'>
                            {$safeName}
                        </div>
                    </div>

                    <div class='field'>
                        <div class='field-label'>Email</div>
                        <div class='field-value'>
                            <a href='mailto:{$safeEmail}'>
                                {$safeEmail}
                            </a>
                        </div>
                    </div>

                    <div class='field'>
                        <div class='field-label'>Subject</div>
                        <div class='field-value'>
                            {$safeSubject}
                        </div>
                    </div>

                    <div class='field'>
                        <div class='field-label'>Message</div>

                        <div class='message-box'>
                            {$safeMessage}
                        </div>

                    </div>

                </div>

                <div class='footer'>
                    This email was automatically generated from the LucidMind Contact Form.
                </div>

            </div>

        </body>
        </html>
        ";

        // ---------------------------------------------------------
        // 12. Plain text version
        // ---------------------------------------------------------

        $altBody =
            "New Contact Submission\n\n" .
            "Name: {$name}\n" .
            "Email: {$email}\n" .
            "Subject: {$subject}\n\n" .
            "Message:\n{$message}";

        // ---------------------------------------------------------
        // 13. Load PHPMailer
        // ---------------------------------------------------------

        require_once __DIR__ . '/../vendor/phpmailer/Exception.php';
        require_once __DIR__ . '/../vendor/phpmailer/PHPMailer.php';
        require_once __DIR__ . '/../vendor/phpmailer/SMTP.php';

        // ---------------------------------------------------------
        // 14. Create PHPMailer
        // ---------------------------------------------------------

        $mail = new PHPMailer(true);

        try {

            // -----------------------------------------------------
            // SMTP
            // -----------------------------------------------------

            $mail->isSMTP();

            $mail->Host = $smtpHost;

            $mail->SMTPAuth = true;

            $mail->Username = $smtpUser;

            $mail->Password = $smtpPassword;

            // SSL / TLS
            if (
                $smtpEncryption === 'tls' ||
                $smtpPort === 587
            ) {

                $mail->SMTPSecure =
                    PHPMailer::ENCRYPTION_STARTTLS;

                $mail->Port = 587;

            } else {

                $mail->SMTPSecure =
                    PHPMailer::ENCRYPTION_SMTPS;

                $mail->Port = 465;
            }

            // -----------------------------------------------------
            // Sender
            // -----------------------------------------------------

            $mail->setFrom(
                $smtpUser,
                'LucidMind Website'
            );

            // -----------------------------------------------------
            // Add ALL recipients
            // -----------------------------------------------------

            foreach ($validReceivers as $receiver) {

                $mail->addAddress($receiver);

            }

            // -----------------------------------------------------
            // Reply to website visitor
            // -----------------------------------------------------

            $mail->addReplyTo(
                $email,
                $name
            );

            // -----------------------------------------------------
            // Email content
            // -----------------------------------------------------

            $mail->isHTML(true);

            $mail->CharSet = 'UTF-8';

            $mail->Subject =
                'New Contact Enquiry from ' .
                $name .
                ': ' .
                $subject;

            $mail->Body = $htmlContent;

            $mail->AltBody = $altBody;

            // -----------------------------------------------------
            // Send
            // -----------------------------------------------------

            $mail->send();

            // -----------------------------------------------------
            // Success
            // -----------------------------------------------------

            echo json_encode([
                'success' => true,
                'message' => 'Message sent successfully.'
            ]);

        } catch (Exception $e) {

            // Log the real PHPMailer error
            error_log(
                'LucidMind PHPMailer Error: ' .
                $mail->ErrorInfo
            );

            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Failed to send message. Please try again later.'
            ]);

        } catch (\Throwable $e) {

            error_log(
                'LucidMind PHP Error: ' .
                $e->getMessage()
            );

            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Failed to send message. Please try again later.'
            ]);
        }
    }
}