export const emailTemplate = (otp:number) => {

  const digitBoxes = otp.toString().split('')
    .map(d => `
      <td style="padding: 0 5px;">
        <div style="
          width: 52px;
          height: 62px;
          background: #0c0c14;
          border: 2px solid #a78bfa;
          border-radius: 12px;
          text-align: center;
          line-height: 62px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 26px;
          font-weight: 700;
          color: #c4b5fd;
          display: inline-block;
        ">${d}</div>
      </td>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saraha — Verify Your Identity</title>
</head>
<body style="margin:0; padding:0; background-color:#0c0c14; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0c0c14; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="540" cellpadding="0" cellspacing="0" border="0" style="max-width:540px; width:100%;">

          <!-- Brand -->
          <tr>
            <td align="center" style="padding-bottom: 28px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 10px;">
                    <div style="
                      width: 40px; height: 40px;
                      border-radius: 11px;
                      background: #a78bfa;
                      text-align: center;
                      line-height: 40px;
                      display: inline-block;
                    ">
                      <span style="color:#fff; font-size:20px; font-weight:bold;">S</span>
                    </div>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-size:24px; font-weight:700; color:#f0f0f8; letter-spacing:-0.5px;">saraha</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#14141e; border:1px solid #222232; border-radius:22px;">

              <!-- top bar -->
              <div style="height:4px; background:linear-gradient(90deg,#a78bfa 0%,#60a5fa 50%,#34d399 100%); border-radius:22px 22px 0 0;"></div>

              <!-- Header -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:32px 40px 28px; border-bottom:1px solid #1c1c2c;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:top; padding-right:14px;">
                          <div style="
                            width:46px; height:46px;
                            background:rgba(167,139,250,0.12);
                            border:1px solid rgba(167,139,250,0.2);
                            border-radius:12px;
                            text-align:center;
                            line-height:46px;
                            display:inline-block;
                          ">
                            <span style="color:#a78bfa; font-size:20px;">&#9993;</span>
                          </div>
                        </td>
                        <td style="vertical-align:top;">
                          <p style="margin:0 0 6px 0; font-size:19px; font-weight:700; color:#f0f0f8;">
                            Verify your identity
                          </p>
                          <p style="margin:0; font-size:13px; color:#5a5a7a; line-height:1.65;">
                            We sent a one-time password to complete your sign-in. Use the code below.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- OTP Section -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:36px 40px 28px;">

                    <p style="margin:0 0 20px 0; font-size:10px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:#3a3a55;">
                      Your one-time password
                    </p>

                    <!-- digit boxes -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 22px auto;">
                      <tr>
                        ${digitBoxes}
                      </tr>
                    </table>

                    <!-- expiry -->
                    <div style="display:inline-block; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.3); border-radius:20px; padding:7px 16px;">
                      <span style="font-size:12px; color:#6a5a30;">
                        Expires in <strong style="color:#f59e0b;">10 minutes</strong>
                      </span>
                    </div>

                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height:1px; background:#1c1c2c; margin:0 40px;"></div>

              <!-- Security Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:26px 40px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:top; padding-right:14px;">
                          <div style="
                            width:38px; height:38px;
                            background:rgba(52,211,153,0.08);
                            border:1px solid rgba(52,211,153,0.2);
                            border-radius:10px;
                            text-align:center;
                            line-height:38px;
                            display:inline-block;
                          ">
                            <span style="color:#34d399; font-size:18px;">&#128737;</span>
                          </div>
                        </td>
                        <td style="vertical-align:top;">
                          <p style="margin:0 0 4px 0; font-size:13px; font-weight:700; color:#9090b0;">
                            Keep this code private
                          </p>
                          <p style="margin:0; font-size:12px; color:#3e3e58; line-height:1.65;">
                            Saraha will never ask for your OTP via chat, phone, or email.
                            If you did not request this code, you can safely ignore this message —
                            your account remains secure.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:#101018; border-top:1px solid #1a1a28; padding:22px 40px; border-radius:0 0 22px 22px;">
                    <p style="margin:0 0 10px 0; font-size:11px; color:#2e2e48; line-height:1.7;">
                      This message was sent because your email is linked to a Saraha account.
                      Need help? Contact us at
                      <a href="mailto:support@saraha.app" style="color:#5a5a7a; text-decoration:none;">support@saraha.app</a>
                    </p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-right:16px;">
                          <a href="#" style="font-size:11px; color:#3a3a58; text-decoration:none;">Privacy Policy</a>
                        </td>
                        <td style="padding-right:16px;">
                          <a href="#" style="font-size:11px; color:#3a3a58; text-decoration:none;">Terms of Service</a>
                        </td>
                        <td>
                          <a href="#" style="font-size:11px; color:#3a3a58; text-decoration:none;">Unsubscribe</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Bottom tag -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="font-size:11px; color:#262638; margin:0;">
                © ${new Date().getFullYear()} Saraha. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
};