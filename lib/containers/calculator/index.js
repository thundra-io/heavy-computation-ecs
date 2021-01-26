const axios = require("axios");
const bodyParser = require("body-parser");
const express = require("express");
const thundra = require("@thundra/core");

const emailHostname = process.env.EMAIL_HOSTNAME || "email";

const app = express();

app.use(thundra.expressMW());
app.use(bodyParser.json());

app.post("/", async ({ body: { email, number } }, response) => {
  response.end();
  const result = await calc(number);
  await axios.post(
    `http://${emailHostname}:8000/`,
    { email, number, result },
    { timeout: 3000 }
  );
});

const f = [];
function calc(n) {
  return new Promise((r) => setTimeout(() => r(n * n), n));
}

app.listen(8000);
