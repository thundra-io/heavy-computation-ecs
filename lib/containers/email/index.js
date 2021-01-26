const bodyParser = require("body-parser");
const express = require("express");
const nodeMailer = require("nodemailer");
const thundra = require("@thundra/core");

const {
  AWS_SES_HOSTNAME,
  AWS_SES_SMTP_USER,
  AWS_SES_SMTP_PASSWORD,
  SOURCE_EMAIL,
} = process.env;

const transporter = nodeMailer.createTransport({
  host: AWS_SES_HOSTNAME,
  port: 587,
  auth: { user: AWS_SES_SMTP_USER, pass: AWS_SES_SMTP_PASSWORD },
});

const app = express();

app.use(thundra.expressMW());
app.use(bodyParser.json());

app.post("/", async ({ body: { email, number, result } }, response) => {
  response.end();
  await transporter.sendMail({
    from: SOURCE_EMAIL,
    to: email,
    subject: "Your Computation Result is Ready",
    text: `${number} times ${number} equals ${result}`,
  });
});

app.listen(8000);
