import { createTransport } from "nodemailer"

type VerificationRequestTypes = {
  email: string,
  url: string,
  server: string,
  from: string,
};

const verificationRequest = async ({ email, url, server, from }:VerificationRequestTypes) => {
  console.log('VERIFIACATION REQUEST')
  const { host } = new URL(url)
  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  const transport = createTransport(server)
  const result = await transport.sendMail({
    to: email,
    from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host }),
  })
  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
  }

}

function html(params: { url: string; host: string; }) {
  const { url, host } = params

  const escapedHost = host.replace(/\./g, "&#8203;.")

  return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      line-height: 1.5;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      padding-bottom: 0px;
      align-text: center;
    }
    h2 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 40px;
      padding-top: 0px;
      padding-bottom: 10px;
      background-color: #ffffff;
    }
    .button-container {
      margin-top: 20px;
      padding-bottom: 20px;
      border-bottom:1px solid rgba(0, 0, 0, 0.15);
    }
    .title {
      font-size: 20px;
      font-weight: bold;
    }
    .button {
      display: inline-block;
      background-color: #4e2a84;
      color: #ffffff !important;
      text-decoration: none !important;
      padding: 10px 20px;
      border-radius: 4px;
    }
    .card {
      margin-top: 40px;
      border-radius: 8px;
      box-shadow: 0 0px 12px rgba(0, 0, 0, 0.15);
      padding: 20px;
      padding-top: 17px;
    }

    .img-wrapper {
      padding-left: 40px;
    }

    .sent {
      font-size: 15px;
    }

    .team {
      font-size: 15px;
      margin-top: 30px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="img-wrapper">
        <img src="https://growthcreative.ai/gc2.png" width="120" height="120" alt="Growth Creative Logo">
        <h2>Growth Creative</h2>
        </div>
      </div>
      <div class="content">
        <p class="title"> Your Login link</p>
        <p class="sent"> This link is valid for the next 24 hours. </p>
        <div class="button-container">
          <a href="${url}" class="button">Log in to Growth Creative</a>
        </div>
        <p class="sent">If you didn't request this login link, you can safely ignore this email.</p>
        <p class="team"> - Growth Creative Team</p>
      </div>
    </div>
    </div>
    </body>
    
    </html>
`
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}


export default verificationRequest;