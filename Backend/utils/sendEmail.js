import nodemailer from "nodemailer";

/**
 * Send an email using Nodemailer
 * @param {Object} options - { to, subject, html, text }
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const emailUser = process.env.EMAIL_USER?.trim();
  // Strip any accidental spaces from Google 16-character app password (e.g. 'abcd efgh ijkl mnop' -> 'abcdefghijklmnop')
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "").trim() : "";

  if (!emailUser || !emailPass || emailUser === "your-email@gmail.com") {
    throw new Error(
      "EMAIL_USER or EMAIL_PASS is not configured in Backend/.env. Please configure your Gmail address and 16-character Google App Password."
    );
  }

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: `"PassOP Security" <${emailUser}>`,
    to,
    subject,
    text,
    html,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Generate a modern, dark-themed HTML email template for password reset
 */
export const generateResetPasswordEmail = (resetUrl, userFullname) => {
  const name = userFullname || "User";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your PassOP Master Password</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0b0f19;
      padding: 40px 10px;
    }
    .main {
      background-color: #0f172a;
      margin: 0 auto;
      width: 100%;
      max-width: 560px;
      border-spacing: 0;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%);
      padding: 32px 36px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .logo-text {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin: 0;
    }
    .logo-accent {
      color: #818cf8;
    }
    .content {
      padding: 36px;
    }
    h2 {
      font-size: 20px;
      font-weight: 700;
      color: #f8fafc;
      margin-top: 0;
      margin-bottom: 16px;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #94a3b8;
      margin: 0 0 20px;
    }
    .btn-container {
      text-align: center;
      padding: 16px 0 24px;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      padding: 14px 32px;
      border-radius: 14px;
      box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
    }
    .callout {
      background-color: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: 12px;
      padding: 14px 18px;
      margin: 20px 0;
    }
    .callout p {
      color: #fcd34d;
      font-size: 12px;
      margin: 0;
    }
    .footer {
      background-color: #080c16;
      padding: 24px 36px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .footer p {
      font-size: 11px;
      color: #64748b;
      margin: 4px 0;
    }
    .link-alt {
      word-break: break-all;
      color: #818cf8;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main" width="100%">
      <tr>
        <td class="header">
          <p class="logo-text">Pass<span class="logo-accent">OP</span> Vault</p>
        </td>
      </tr>
      <tr>
        <td class="content">
          <h2>Reset Your Master Password</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>We received a request to reset the master password for your PassOP vault account. Click the button below to choose a new secure password:</p>
          
          <div class="btn-container">
            <a href="${resetUrl}" target="_blank" class="btn">Reset Master Password</a>
          </div>

          <div class="callout">
            <p><strong>Security Notice:</strong> This password reset link is valid for <strong>15 minutes</strong> only and can be used once. If you did not make this request, you can safely ignore this email — your account remains secure.</p>
          </div>

          <p style="font-size: 12px; color: #64748b; margin-top: 24px;">
            If the button doesn't work, copy and paste this URL into your browser:
            <br>
            <a href="${resetUrl}" class="link-alt">${resetUrl}</a>
          </p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p>&copy; ${new Date().getFullYear()} PassOP Password Manager. All rights reserved.</p>
          <p>End-to-End Encrypted Digital Identity & Password Protection.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
};

/**
 * Generate a modern, dark-themed HTML email template for 6-Digit OTP verification
 */
export const generateOtpEmail = (otp, userFullname) => {
  const name = userFullname || "User";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your PassOP Password Reset OTP</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0b0f19;
      padding: 40px 10px;
    }
    .main {
      background-color: #0f172a;
      margin: 0 auto;
      width: 100%;
      max-width: 560px;
      border-spacing: 0;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%);
      padding: 32px 36px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .logo-text {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin: 0;
    }
    .logo-accent {
      color: #818cf8;
    }
    .content {
      padding: 36px;
    }
    h2 {
      font-size: 20px;
      font-weight: 700;
      color: #f8fafc;
      margin-top: 0;
      margin-bottom: 16px;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #94a3b8;
      margin: 0 0 20px;
    }
    .otp-container {
      text-align: center;
      padding: 24px 0 28px;
    }
    .otp-box {
      display: inline-block;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
      border: 2px dashed #818cf8;
      border-radius: 18px;
      padding: 16px 36px;
      letter-spacing: 8px;
      font-size: 36px;
      font-weight: 900;
      font-family: 'Courier New', Courier, monospace;
      color: #38bdf8;
      text-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
    }
    .callout {
      background-color: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: 12px;
      padding: 14px 18px;
      margin: 20px 0;
    }
    .callout p {
      color: #fcd34d;
      font-size: 12px;
      margin: 0;
    }
    .footer {
      background-color: #080c16;
      padding: 24px 36px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .footer p {
      font-size: 11px;
      color: #64748b;
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main" width="100%">
      <tr>
        <td class="header">
          <p class="logo-text">Pass<span class="logo-accent">OP</span> Vault</p>
        </td>
      </tr>
      <tr>
        <td class="content">
          <h2>Password Reset Verification Code</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>You requested to reset your master password. Use the 6-digit verification code (OTP) below to authenticate your request:</p>
          
          <div class="otp-container">
            <div class="otp-box">${otp}</div>
          </div>

          <div class="callout">
            <p><strong>Security Notice:</strong> This code is valid for <strong>10 minutes</strong>. Never share this code with anyone. PassOP support will never ask for your verification code.</p>
          </div>

          <p style="font-size: 12px; color: #64748b; margin-top: 24px;">
            If you did not request a password reset, your vault remains securely locked. You can safely ignore this email.
          </p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p>&copy; ${new Date().getFullYear()} PassOP Password Manager. All rights reserved.</p>
          <p>Zero-Knowledge Encrypted Credentials Vault.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
};

