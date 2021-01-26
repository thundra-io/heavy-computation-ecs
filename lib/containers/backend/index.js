const axios = require("axios");
const bodyParser = require("body-parser");
const express = require("express");
const thundra = require("@thundra/core");

const calculatorHostname = process.env.CALCULATOR_HOSTNAME || "calculator";
const errorHostname = process.env.ERROR_HOSTNAME || "error";

const app = express();

app.use(thundra.expressMW());
app.use(bodyParser.json());

app.post("/", async ({ body: { email, number } }, response) => {
  response.end(JSON.stringify({ email, number }));
  await axios.post(
    `http://${calculatorHostname}:8000/`,
    { email, number },
    { timeout: 3000 }
  );
  await axios.post(
    `http://${errorHostname}:8000/`,
    { email, number },
    { timeout: 3000 }
  );
});

app.listen(8000);
