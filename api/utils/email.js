import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendVerificationOtpEmail({ to, name, otp }) {
  const fromName    = process.env.EMAIL_FROM_NAME    || "Fazaljees";
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Verify Your Email — Fazaljees</title>
</head>
<body style="margin:0;padding:0;background:#FAF8F5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#3F312B 0%,#8A5A44 100%);padding:32px 40px;text-align:center;border-radius:16px 16px 0 0;">
            <p style="color:#C9A646;font-size:26px;margin:0;letter-spacing:3px;font-weight:900;text-transform:uppercase;">Fazaljees</p>
            <p style="color:#E8DDD1;font-size:11px;margin:6px 0 0;letter-spacing:4px;text-transform:uppercase;">Premium Islamic Store</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#FFFFFF;padding:40px 40px 32px;border-left:1px solid #E8DDD1;border-right:1px solid #E8DDD1;">
            <h2 style="color:#27211E;font-size:22px;margin:0 0 12px;font-weight:800;">Verify Your Email Address</h2>
            <p style="color:#6F5E55;font-size:15px;line-height:1.7;margin:0 0 28px;">
              Assalamu Alaikum <strong style="color:#3F312B;">${name}</strong>,<br/>
              Enter the code below to complete your Fazaljees account setup.
              This code is valid for <strong>10 minutes</strong>.
            </p>

            <!-- OTP Box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td style="background:#F7F2EC;border:2px solid #E8DDD1;border-radius:12px;padding:28px;text-align:center;">
                  <p style="color:#8A5A44;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:0 0 14px;font-weight:700;">Your Verification Code</p>
                  <p style="letter-spacing:14px;font-size:42px;font-weight:900;color:#3F312B;font-family:'Courier New',monospace;margin:0;padding-left:14px;">${otp}</p>
                </td>
              </tr>
            </table>

            <p style="color:#9B8C83;font-size:13px;line-height:1.6;margin:0 0 10px;">
              ⚠️ <strong style="color:#3F312B;">Never share this code with anyone.</strong>
              Fazaljees will never ask for your verification code.
            </p>
            <p style="color:#9B8C83;font-size:13px;line-height:1.6;margin:0;">
              If you did not request this, you can safely ignore this email.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F7F2EC;padding:20px 40px;border:1px solid #E8DDD1;border-top:none;border-radius:0 0 16px 16px;text-align:center;">
            <p style="color:#B8AAA0;font-size:12px;margin:0;">© ${new Date().getFullYear()} Fazaljees. All rights reserved.</p>
            <p style="color:#B8AAA0;font-size:11px;margin:6px 0 0;">Premium Islamic Store — Pakistan</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Assalamu Alaikum ${name},\n\nYour Fazaljees verification code is: ${otp}\n\nThis code expires in 10 minutes. Never share it with anyone.\n\nIf you did not request this, please ignore this email.\n\n— Fazaljees Team`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from:    `"${fromName}" <${fromAddress}>`,
    to,
    subject: `${otp} is your Fazaljees verification code`,
    html,
    text,
  });
}

export async function sendPasswordResetOtpEmail({ to, name, otp }) {
  const fromName    = process.env.EMAIL_FROM_NAME    || "Fazaljees";
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER;
  const displayName = name || "Valued Customer";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Reset Your Password — Fazaljees</title>
</head>
<body style="margin:0;padding:0;background:#FAF8F5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

        <tr>
          <td style="background:linear-gradient(135deg,#3F312B 0%,#8A5A44 100%);padding:32px 40px;text-align:center;border-radius:16px 16px 0 0;">
            <p style="color:#C9A646;font-size:26px;margin:0;letter-spacing:3px;font-weight:900;text-transform:uppercase;">Fazaljees</p>
            <p style="color:#E8DDD1;font-size:11px;margin:6px 0 0;letter-spacing:4px;text-transform:uppercase;">Premium Islamic Store</p>
          </td>
        </tr>

        <tr>
          <td style="background:#FFFFFF;padding:40px 40px 32px;border-left:1px solid #E8DDD1;border-right:1px solid #E8DDD1;">
            <h2 style="color:#27211E;font-size:22px;margin:0 0 12px;font-weight:800;">Reset Your Password</h2>
            <p style="color:#6F5E55;font-size:15px;line-height:1.7;margin:0 0 28px;">
              Assalamu Alaikum <strong style="color:#3F312B;">${displayName}</strong>,<br/>
              We received a request to reset the password for your Fazaljees account.
              Use the code below to create a new password.
              This code is valid for <strong>10 minutes</strong>.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td style="background:#F7F2EC;border:2px solid #E8DDD1;border-radius:12px;padding:28px;text-align:center;">
                  <p style="color:#8A5A44;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:0 0 14px;font-weight:700;">Password Reset Code</p>
                  <p style="letter-spacing:14px;font-size:42px;font-weight:900;color:#3F312B;font-family:'Courier New',monospace;margin:0;padding-left:14px;">${otp}</p>
                </td>
              </tr>
            </table>

            <p style="color:#9B8C83;font-size:13px;line-height:1.6;margin:0 0 10px;">
              ⚠️ <strong style="color:#3F312B;">Never share this code with anyone.</strong>
              Fazaljees staff will never ask for your reset code.
            </p>
            <p style="color:#9B8C83;font-size:13px;line-height:1.6;margin:0;">
              If you did not request a password reset, please ignore this email.
              Your password will remain unchanged.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#F7F2EC;padding:20px 40px;border:1px solid #E8DDD1;border-top:none;border-radius:0 0 16px 16px;text-align:center;">
            <p style="color:#B8AAA0;font-size:12px;margin:0;">© ${new Date().getFullYear()} Fazaljees. All rights reserved.</p>
            <p style="color:#B8AAA0;font-size:11px;margin:6px 0 0;">Premium Islamic Store — Pakistan</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Assalamu Alaikum ${displayName},\n\nYour Fazaljees password reset code is: ${otp}\n\nThis code expires in 10 minutes. Never share it with anyone.\n\nIf you did not request a password reset, please ignore this email. Your password will remain unchanged.\n\n— Fazaljees Team`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from:    `"${fromName}" <${fromAddress}>`,
    to,
    subject: `${otp} is your Fazaljees password reset code`,
    html,
    text,
  });
}

export async function sendPasswordChangedEmail({ to, name, changedAt }) {
  const fromName    = process.env.EMAIL_FROM_NAME    || "Fazaljees";
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER;
  const displayName = name || "Valued Customer";
  const timeStr     = changedAt
    ? new Date(changedAt).toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" })
    : "just now";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Password Changed — Fazaljees</title>
</head>
<body style="margin:0;padding:0;background:#FAF8F5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

        <tr>
          <td style="background:linear-gradient(135deg,#3F312B 0%,#8A5A44 100%);padding:32px 40px;text-align:center;border-radius:16px 16px 0 0;">
            <p style="color:#C9A646;font-size:26px;margin:0;letter-spacing:3px;font-weight:900;text-transform:uppercase;">Fazaljees</p>
            <p style="color:#E8DDD1;font-size:11px;margin:6px 0 0;letter-spacing:4px;text-transform:uppercase;">Premium Islamic Store</p>
          </td>
        </tr>

        <tr>
          <td style="background:#FFFFFF;padding:40px 40px 32px;border-left:1px solid #E8DDD1;border-right:1px solid #E8DDD1;">
            <h2 style="color:#27211E;font-size:22px;margin:0 0 12px;font-weight:800;">Password Changed Successfully</h2>
            <p style="color:#6F5E55;font-size:15px;line-height:1.7;margin:0 0 20px;">
              Assalamu Alaikum <strong style="color:#3F312B;">${displayName}</strong>,<br/>
              Your Fazaljees account password was changed on <strong>${timeStr}</strong>.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
              <tr>
                <td style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:18px 20px;">
                  <p style="color:#DC2626;font-size:14px;font-weight:700;margin:0 0 6px;">🔒 Security Alert</p>
                  <p style="color:#7F1D1D;font-size:13px;line-height:1.6;margin:0;">
                    If you made this change, no action is needed.<br/>
                    If you did <strong>not</strong> make this change, your account may be compromised.
                    Please contact our support team immediately.
                  </p>
                </td>
              </tr>
            </table>

            <p style="color:#9B8C83;font-size:13px;line-height:1.6;margin:0;">
              For security, all existing login sessions have been ended.
              Please log in again with your new password.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#F7F2EC;padding:20px 40px;border:1px solid #E8DDD1;border-top:none;border-radius:0 0 16px 16px;text-align:center;">
            <p style="color:#B8AAA0;font-size:12px;margin:0;">© ${new Date().getFullYear()} Fazaljees. All rights reserved.</p>
            <p style="color:#B8AAA0;font-size:11px;margin:6px 0 0;">Premium Islamic Store — Pakistan</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Assalamu Alaikum ${displayName},\n\nYour Fazaljees account password was changed on ${timeStr}.\n\nIf you made this change, no action is needed.\nIf you did NOT make this change, please contact our support team immediately — your account may be compromised.\n\nAll existing login sessions have been ended. Please log in again with your new password.\n\n— Fazaljees Team`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from:    `"${fromName}" <${fromAddress}>`,
    to,
    subject: "Your Fazaljees password has been changed",
    html,
    text,
  });
}

export async function sendGoogleAccountInfoEmail({ to, name }) {
  const fromName    = process.env.EMAIL_FROM_NAME    || "Fazaljees";
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER;
  const displayName = name || "Valued Customer";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>About Your Fazaljees Account</title>
</head>
<body style="margin:0;padding:0;background:#FAF8F5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

        <tr>
          <td style="background:linear-gradient(135deg,#3F312B 0%,#8A5A44 100%);padding:32px 40px;text-align:center;border-radius:16px 16px 0 0;">
            <p style="color:#C9A646;font-size:26px;margin:0;letter-spacing:3px;font-weight:900;text-transform:uppercase;">Fazaljees</p>
            <p style="color:#E8DDD1;font-size:11px;margin:6px 0 0;letter-spacing:4px;text-transform:uppercase;">Premium Islamic Store</p>
          </td>
        </tr>

        <tr>
          <td style="background:#FFFFFF;padding:40px 40px 32px;border-left:1px solid #E8DDD1;border-right:1px solid #E8DDD1;">
            <h2 style="color:#27211E;font-size:22px;margin:0 0 12px;font-weight:800;">About Your Account</h2>
            <p style="color:#6F5E55;font-size:15px;line-height:1.7;margin:0 0 20px;">
              Assalamu Alaikum <strong style="color:#3F312B;">${displayName}</strong>,<br/>
              We received a request to reset the password for your Fazaljees account at <strong>${to}</strong>.
            </p>
            <p style="color:#6F5E55;font-size:15px;line-height:1.7;margin:0 0 20px;">
              Your account was created using <strong>Google Sign-In</strong> and does not have a separate password.
              To access your account, please use the <strong>"Continue with Google"</strong> option on the Fazaljees login page.
            </p>
            <p style="color:#9B8C83;font-size:13px;line-height:1.6;margin:0;">
              If you did not make this request, your account is safe — no changes were made.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#F7F2EC;padding:20px 40px;border:1px solid #E8DDD1;border-top:none;border-radius:0 0 16px 16px;text-align:center;">
            <p style="color:#B8AAA0;font-size:12px;margin:0;">© ${new Date().getFullYear()} Fazaljees. All rights reserved.</p>
            <p style="color:#B8AAA0;font-size:11px;margin:6px 0 0;">Premium Islamic Store — Pakistan</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Assalamu Alaikum ${displayName},\n\nWe received a request to reset the password for your Fazaljees account.\n\nYour account was created using Google Sign-In and does not have a separate password. To access your account, please use "Continue with Google" on the Fazaljees login page.\n\nIf you did not make this request, your account is safe — no changes were made.\n\n— Fazaljees Team`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from:    `"${fromName}" <${fromAddress}>`,
    to,
    subject: "About your Fazaljees account sign-in",
    html,
    text,
  });
}
