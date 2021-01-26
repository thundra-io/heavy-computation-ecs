const express = require("express");
const thundra = require("@thundra/core");

const app = express();

app.use(thundra.expressMW());

app.post("/", async (request, response) => {
  const error = null.a;
});

app.listen(8000);
