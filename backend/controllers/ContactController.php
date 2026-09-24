<?php

class ContactController {
    public function handleRequest($method, $args) {
        if ($method === 'POST') {
            $this->sendEmail();
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Route not found']);
        }
    }

    private function sendEmail() {
        $rawInput = file_get_contents("php://input");
        $data = json_decode($rawInput, true);

        if (!$data || !is_array($data)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid JSON payload received.'
            ]);
            return;
        }
        
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $subject = trim($data['subject'] ?? '');
        $message = trim($data['message'] ?? '');

        // Header injection protection: strictly reject CR/LF in single-line headers
        if (preg_match("/[\r\n]/", $name) || preg_match("/[\r\n]/", $email) || preg_match("/[\r\n]/", $subject)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid header characters in input.'
            ]);
            return;
        }

        // Validate required fields and email format
        if (empty($name) || empty($email) || empty($subject) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Valid name, email, subject, and message are required.'
            ]);
            return;
        }

        // Helper to safely load environment variables
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

        if (empty($receiverEmail) || empty($smtpUser) || empty($smtpPassword)) {
            error_log('LucidMind SMTP error: Environment variables (SMTP_USER, SMTP_APP_PASSWORD, RECEIVER_EMAIL) are missing.');
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to send message. Please try again later.'
            ]);
            return;
        }

        // Clean up any internal whitespace in app password
        $smtpPassword = str_replace(' ', '', $smtpPassword);
        
        // Safely escape user input for HTML
        $safeName    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $safeEmail   = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
        $safeSubject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
        $safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
        $plainMessage = htmlspecialchars_decode($message, ENT_QUOTES);

        $htmlContent = "
        <html>
        <head>
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background-color: #000000; padding: 25px; text-align: center; }
            .header img { max-height: 120px; }
            .content { padding: 30px; color: #333333; }
            .content h2 { margin-top: 0; color: #1a1a1a; font-size: 20px; margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px;}
            .field { margin-bottom: 20px; }
            .field-label { font-size: 12px; text-transform: uppercase; color: #888888; letter-spacing: 1px; margin-bottom: 5px; }
            .field-value { font-size: 16px; background: #f9f9f9; padding: 12px 15px; border-left: 3px solid #000000; border-radius: 4px; }
            .message-box { background: #f9f9f9; padding: 15px; border-radius: 4px; border: 1px solid #eeeeee; font-size: 15px; line-height: 1.6; }
            .footer { background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #aaaaaa; border-top: 1px solid #eeeeee;}
          </style>
        </head>
        <body>
          <div class='container'>
            <div class='header'>
              <img src='https://lucidmind.co.in/assets/logo/Lucid-mind-logos.png' alt='LucidMind Logo' />
            </div>
            <div class='content'>
              <h2>New Contact Submission</h2>
              <div class='field'>
                <div class='field-label'>Name</div>
                <div class='field-value'>$safeName</div>
              </div>
              <div class='field'>
                <div class='field-label'>Email</div>
                <div class='field-value'><a href='mailto:$safeEmail' style='color: #000; text-decoration: none;'>$safeEmail</a></div>
              </div>
              <div class='field'>
                <div class='field-label'>Subject</div>
                <div class='field-value'>$safeSubject</div>
              </div>
              <div class='field'>
                <div class='field-label'>Message</div>
                <div class='message-box'>$safeMessage</div>
              </div>
            </div>
            <div class='footer'>
              This email was automatically generated from the LucidMind Contact Form.
            </div>
          </div>
        </body>
        </html>
        ";

        $altBody = "New Contact Submission\n\nName: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$plainMessage";

        require_once __DIR__ . '/../vendor/phpmailer/Exception.php';
        require_once __DIR__ . '/../vendor/phpmailer/PHPMailer.php';
        require_once __DIR__ . '/../vendor/phpmailer/SMTP.php';

        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);

        try {
            $mail->SMTPDebug = 0;
            $mail->isSMTP();
            $mail->Host       = $smtpHost;
            $mail->SMTPAuth   = true;
            $mail->Username   = $smtpUser;
            $mail->Password   = $smtpPassword;
            if ($smtpEncryption === 'tls' || $smtpPort === 587) {
                $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            } else {
                $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
            }
            $mail->Port       = $smtpPort;

            // Sender must match authenticated user to maximize deliverability
            $mail->setFrom($smtpUser, 'LucidMind Website');
            
            // Destination address
            $mail->addAddress($receiverEmail);
            
            // Visitor email as Reply-To
            $mail->addReplyTo($email, $name);

            $mail->isHTML(true);
            $mail->Subject = "New Contact Submission from $safeName: $safeSubject";
            $mail->Body    = $htmlContent;
            $mail->AltBody = $altBody;

            $mail->send();
            
            echo json_encode([
                'success' => true,
                'message' => 'Message sent successfully.'
            ]);
        } catch (\PHPMailer\PHPMailer\Exception $e) {
            error_log('LucidMind SMTP error: ' . $mail->ErrorInfo);
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to send message. Please try again later.'
            ]);
        } catch (\Exception $e) {
            error_log('LucidMind SMTP error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to send message. Please try again later.'
            ]);
        }
    }
}
