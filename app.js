require("dotenv").config();
const express = require("express");
const routes = require("./routes/routes");
const {
  port
} = require('./config/web-config');

const app = express();

app.use(express.json());

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});

// Static files
app.use(express.static("public"));

// Routes
routes(app);
