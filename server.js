const express = require("express");
const allRoutes = require('./controllers')
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
// const cors = require("cors");

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

const User = require("./models/userModel.js");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static("public"));
app.use('/', allRoutes);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/zooauthdb", { useNewUrlParser: true });


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});