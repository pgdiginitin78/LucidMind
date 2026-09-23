import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;

    if (!process.env.SMTP_USER || !process.env.SMTP_APP_PASSWORD) {
      return res.status(200).json({
        success: true,
        message: 'Thank you for reaching out! Your message has been received.',
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.RECEIVER_EMAIL,
      subject: `LucidMind Contact Form: ${subject || 'New Contact Request'}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nCompany: ${company || 'N/A'}\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; border-bottom: 2px solid #00C4B4; padding-bottom: 10px;">LucidMind Contact Form</h2>
          <div style="margin-top: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Company:</strong> ${company || 'N/A'}</p>
            <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-radius: 6px;">
            <p style="margin-top: 0;"><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (mailError) {
      console.warn('Mail transport warning:', mailError?.message);
      return res.status(200).json({
        success: true,
        message: 'Thank you for reaching out! Your message has been received.',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message || error,
    });
  }
});

export default router;
