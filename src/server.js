const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const EventSchema = require("./schemas.js").EventSchema;
const VenueSchema = require("./schemas.js").VenueSchema;
const CommentSchema = require("./schemas.js").CommentSchema;
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

const Event = mongoose.model("Event", EventSchema);
const Venue = mongoose.model("Venue", VenueSchema);
const Comment = mongoose.model("Comment", CommentSchema);
//get venue details
app.get("/venue/:venueId", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Venue.findOne({ venueId: req.params.venueId })
    .then((data) => {
      let venue = {
        venueId: data.venueId,
        venueName: data.venueName,
        lat: data.lat,
        long: data.long,
      };
      res.status(200);
      res.send(venue);
    })
    .catch((err) => {
      res.status(404);
      res.send("Venue not found");
    });
});
// get comments
app.get("/comments/:venueId", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Comment.find({ venueId: req.params.venueId })
    .then((data) => {
      let comments = data.map((item, idx) => {
        return { user: item.user, venueId: item.venueId, content: item.content };
      });
      res.status(200);
      res.send(comments);
    })
    .catch((err) => {
      console.log(err);
      res.status(406);
      res.send(err);
    });
});

//new comment
app.post("/newcomment", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  Comment.create({
    user: req.body.user,
    venueId: req.body.venueId,
    content: req.body.content,
  })
    .then(() => {
      res.status(200);
      res.send("New event created");
    })
    .catch((err) => {
      res.status(406);
      res.send(err);
    });
});

// handle ALL requests
app.all("/*", (req, res) => {
  //console.log(req);
  // send this to client
  res.send("Hello World!");
});

// listen to port 8000
const server = app.listen(8000);
