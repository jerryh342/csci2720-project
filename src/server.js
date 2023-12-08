const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect("mongodb+srv://admin:admin@csci2720proj.pqtx7pq.mongodb.net/?retryWrites=true&w=majority"); // my cloud deployment
const db = mongoose.connection;
// Upon connection failure
db.on("error", console.error.bind(console, "Connection error:"));
// Upon opening the database successfully
db.once("open", function () {
  console.log("Connection is open...");
});

// handle ALL requests
app.all("/*", (req, res) => {
  // send this to client
  res.send("Hello World!");
});
// listen to port 3000
const server = app.listen(3000);
