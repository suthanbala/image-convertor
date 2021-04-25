const express = require("express");
const dotEnv = require("dotenv");
const routes = require("./routes");

const app = express();
const port = 3000;
dotEnv.config();

app.use(express.json());

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});

// Static files
app.use(express.static("public"));

// Routes
routes(app);
