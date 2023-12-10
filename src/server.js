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

//Read Specific Event data
 app.get("/ev/:eventId", (req, res) =>{
    Event.findOne({eventId:req.params.eventId})
    .populate("venue")
    .then((data) => {
      if(!data){
        res.setHeader('Content-Type', 'text/plain');
        res.status(404).send('Event was not found');
      }
      else{
        const eventData ={
          eventId: data.eventId,
          title: data.title,
          venue:
          {
          venueId: data.venue.venueId,
          venueName: data.venue.venueName,
          lat: data.venue.lat,
          long: data.venue.long,
        },
          dateTime: data.dateTime,
          desc: data.desc,
          presenter: data.presenter,
          price: data.price}
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(JSON.stringify(eventData,null,2));
      }
  })
    .catch((err) => {
      res.setHeader('Content-Type', 'text/plain');
      res.status(500).send('Internal Server Error');
    });
    });

//Read event with Quota greater than q
    app.get("/ev", (req, res) =>{
      if (req.query.q === undefined){
        Event.find({})
        .populate("venue")
        .then((data) => {
          const output = [] ;
          for (length in data){
              output.push({
                eventId: data[length].eventId,
                title: data[length].title,
                venue:
                {
                venueId: data[length].venue.venueId,
                venueName: data[length].venue.venueName,
                lat: data[length].venue.lat,
                long: data[length].venue.long,
              },
                dateTime: data[length].dateTime,
                desc: data[length].desc,
                presenter: data[length].presenter,
                price: data[length].price})
          }
          res.setHeader('Content-Type', 'text/plain');
          res.status(200).send(JSON.stringify(output,null,2));
          })
        .catch((err) => {
          res.setHeader('Content-Type', 'text/plain');
          res.status(500).send('Internal Server Error');
        });
      }
      else {
        Event.find({quota:{$gte:req.query.q}})
        .populate("venue")
        .then((data) => {
          const output = [] ;
          for (length in data){
            output.push({
              eventId: data[length].eventId,
              title: data[length].title,
              venue:
              {
              venueId: data[length].venue.venueId,
              venueName: data[length].venue.venueName,
              lat: data[length].venue.lat,
              long: data[length].venue.long,
            },
              dateTime: data[length].dateTime,
              desc: data[length].desc,
              presenter: data[length].presenter,
              price: data[length].price})
        }
          res.setHeader('Content-Type', 'text/plain');
          res.status(200).send(JSON.stringify(output,null,2));
          })
        .catch((err) => {
          res.setHeader('Content-Type', 'text/plain');
          res.status(500).send('Internal Server Error');
        });
      }
  });
   
//Create Event data
    app.post('/ev', (req, res) => {
      const venueId = req.body.venueId;
      Venue.findOne({venueId:venueId})
      .then((venueData) => {
            Event.findOne({}).sort({eventId:-1}).limit(1)
            .then((data) => {
              const newMax = data.eventId+1;
              let newEvent = new Event({
                eventId: newMax,
                title: req.body.title,
                venue: venueData._id,
                dateTime: data.dateTime,
                desc: data.desc,
                presenter: data.presenter,
                price: req.body.price,
              });
              newEvent
                .save()
                .then(() => {
                  res.status(201).send(`http://localhost:3000/ev/${newMax}`);
                  console.log("a new event created successfully");
                })
                .catch((error) => {
                  console.log("failed to save new event");
                });
            })
          })
      .catch((err) => {
        res.setHeader('Content-Type', 'text/plain');
        res.status(500).send('Internal Server Error');
      });
  });

// Delete Event data
      app.delete("/ev/:eventId", (req, res) =>{
      Event.findOneAndDelete({eventId:req.params.eventId})
        .then((data) => {
          if(data){res.sendStatus(204);}
          else{
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Event was not found, no event was deleted.');
            console.log('Event was not found, no event was deleted.');
          }
        })
        .catch((error) => {
          res.setHeader('Content-Type', 'text/plain');
          res.status(500).send('Internal Server Error');
        });
  });

//Update Event Data
    app.put("/ev/:eventId", (req, res) =>{
      const newvenueId = req.body.venueId;
      Venue.findOne({venueId: newvenueId})
      .then((NewVenueData) => {
        let NewVenueId = NewVenueData._id;
        let new_data = {
          title: req.body.title,
          venue: NewVenueData._id,
          dateTime: req.body.dateTime,
          desc: req.body.desc,
          presenter: req.body.presenter,
          price: req.body.price,
        };
        Event.findOneAndUpdate(
          {eventId: {$eq:req.body.eventId}},
          new_data,
          {new: true},
        ).populate("venue")      
        .then((data) => {
          const NeweventData ={
            eventId: data.eventId,
            name: data.name,
            venue:
            {
              venueId: data.venue.venueId,
              venueName: data.venue.venueName,
              lat: data.venue.lat,
              long: data.venue.long,
            },
              dateTime: data.dateTime,
              desc: data.desc,
              presenter: data.presenter,
              price: data.price}
          res.setHeader('Content-Type', 'text/plain');
          res.status(200).send(JSON.stringify(NeweventData,null,2));})
        .catch((error) => console.log(error));
      }) 
          });  

// handle ALL requests
app.all("/*", (req, res) => {
  //console.log(req);
  // send this to client
  res.send("Hello World!");
});

// listen to port 8000
const server = app.listen(8000);
