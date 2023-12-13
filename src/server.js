const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const EventSchema = require("./schemas.js").EventSchema;
const VenueSchema = require("./schemas.js").VenueSchema;
const CommentSchema = require("./schemas.js").CommentSchema;
const LoginSchema = require("./schemas.js").LoginSchema;
const InviteSchema = require("./schemas.js").InviteSchema;
const LoginModel = mongoose.model("login", LoginSchema);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

mongoose.connect("mongodb+srv://admin:admin@csci2720proj.pqtx7pq.mongodb.net/?retryWrites=true&w=majority"); // put your own database link here

const db = mongoose.connection;
// Upon connection failure
db.on("error", console.error.bind(console, "Connection error:"));
// Upon opening the database successfully
db.once("open", function () {
  console.log("Connection is open... success");
  app.get("/home", checkAuth, (req, res) => {
    res.send("Authenticated");
  });

  app.get("/login", (req, res) => {
    res.status(403).send("login");
  });

  app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      console.log("running");
      console.log("user", user);
      if (err) throw err;
      if (!user) res.send("Password or Username dont match");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.status(200).send("Successfully Authenticated");
          console.log(req.user);
        });
      }
    })(req, res, next);
  });

  app.post("/register", async (req, res) => {
    try {
      const { values } = req.body;
      console.log("values>>", values);
      const username = values.username ? values.username : "";
      const email = values.email ? values.email : "";
      const password = values.password ? await bcrypt.hash(values.password, 10) : "";
      console.log("username>> ", username);
      console.log("email>> ", email);
      console.log("password>> ", password);

      if (!username || !email || !password) {
        return res.status(406).send("Field missing");
      }

      LoginModel.create({
        username: username,
        email: email,
        password: password,
      })
        .then((user) => res.json(user))
        .catch((err) => res.json(err));
    } catch (error) {}
  });

  app.delete("/logout", (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/login");
    });
  });

  app.get("/checkAuth", (req, res) => {
    res.set("Content-Type", "application/json");
    console.log("checking>>>");
    if (req.isAuthenticated()) {
      console.log("checkAuth");
      return res.status(200).send(req.user);
    }
    return res.status(403).send("Not Auth");
  });

  function checkAuth(req, res, next) {
    console.log("req.user>", req.user);
    console.log("req.isAuthenticated())>>", req.isAuthenticated());
    if (req.isAuthenticated()) {
      console.log("req.isAuthenticated>>", req.isAuthenticated);
      return next();
    }
    console.log("redirectted");
    res.redirect("/login");
  }
});

const Event = mongoose.model("Event", EventSchema);
const Venue = mongoose.model("Venue", VenueSchema);
const Comment = mongoose.model("Comment", CommentSchema);
const Invite = mongoose.model("Invite", InviteSchema);

app.get("/venue/:venueId/ev", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Event.find()
    .populate({
      path: "venue",
      match: { venueId: req.params.venueId },
    })
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(404);
      res.send("Venue not found");
    });
});
//show all location data
app.get("/venue", async (req, res) => {
  try {
    const data = await Venue.find();
    const venues = [];

    for (const item of data) {
      const count = await Event.countDocuments({ venue: item.venueId });
      venues.push({
        name: item.venueName,
        lat: item.lat,
        long: item.long,
        locid: item.venueId,
        eventCount: count,
      });
    }

    res.status(200).send(venues);
  } catch (err) {
    console.log(err);
    res.status(406).send(err);
  }
});

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
//show all location data
app.get("/venue", (req, res) => {
  Venue.find()
    .then((data) => {
      let venues = data.map((item, idx) => {
        return { name: item.venueName, lat: item.lat, long: item.long, locid: item.venueId };
      });
      res.status(200);
      res.send(venues);
    })
    .catch((err) => {
      console.log(err);
      res.status(406);
      res.send(err);
    });
});

// get comments
app.get("/comments/:venueId", (req, res) => {
  Comment.find({ venueId: req.params.venueId })
    .populate("user")
    .then((data) => {
      let comments = data.map((item, idx) => {
        return { user: item.user.username, venueId: item.venueId, content: item.content };
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
  const usrname = req.body.user;
  LoginModel.findOne({ username: usrname })
    .then((data) => {
      const userId = data._id;
      Comment.create({
        user: userId,
        venueId: req.body.venueId,
        content: req.body.content,
      })
        .then(() => {
          res.status(200);
          res.send("New comment created");
        })
        .catch((err) => {
          res.status(406);
          res.send(err);
        });
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});
//update/create new invite
app.put("/invites/update/:eventId", async (req, res) => {
  const user = await LoginModel.findOne({ username: req.body.username });
  const invite = await Invite.findOne().populate({
    path: "event",
    match: { eventId: req.params.eventId },
  });
  if (invite) {
    req.body.delete ? invite.users.pull({ _id: user._id }) : invite.users.addToSet(user._id);
    console.log(invite.users.length);
    invite.users.length
      ? invite.save().then(() => res.status(200).send("Updated"))
      : Invite.findByIdAndDelete(invite._id).then(() => res.status(200).send("Empty Invite, Removed"));
  } else {
    if (!req.body.delete) {
      const userArray = [];
      const event = await Event.findOne({ eventId: req.params.eventId });
      userArray.push(user._id);
      console.log(userArray);
      Invite.create({
        event: event._id,
        users: userArray,
      })
        .then(() => res.status(200).send("New Invite Created"))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(406).send("Cannot delete!");
    }
  }
});

//Get event invite for 1 event
app.post("/invites/:eventId", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Invite.findOne({})
    .populate([
      {
        path: "users",
      },
      {
        path: "event",
        match: { eventId: req.params.eventId },
      },
    ])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

//get all invites
app.get("/invites", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Invite.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((data) => {
      res.status(404).send(null);
    });
});

//Read Specific Event data
app.get("/ev/:eventId", (req, res) => {
  Event.findOne({ eventId: req.params.eventId })
    .populate("venue")
    .then((data) => {
      if (!data) {
        res.setHeader("Content-Type", "text/plain");
        res.status(404).send("Event was not found");
      } else {
        const eventData = {
          eventId: data.eventId,
          title: data.title,
          venue: {
            venueId: data.venue.venueId,
            venueName: data.venue.venueName,
            lat: data.venue.lat,
            long: data.venue.long,
          },
          dateTime: data.dateTime,
          desc: data.desc,
          presenter: data.presenter,
          price: data.price,
        };
        res.setHeader("Content-Type", "text/plain");
        res.status(200).send(JSON.stringify(eventData, null, 2));
      }
    })
    .catch((err) => {
      res.setHeader("Content-Type", "text/plain");
      res.status(500).send("Internal Server Error");
    });
});

//Read Specific User data
app.get("/user/:userName", (req, res) => {
  Event.findOne({ username: req.params.userName })
    .then((data) => {
      if (!data) {
        res.setHeader("Content-Type", "text/plain");
        res.status(404).send("User was not found");
      } else {
        const userData = {
          username: data.username,
          email: data.email,
          password: data.password,
        };
        res.setHeader("Content-Type", "text/plain");
        res.status(200).send(JSON.stringify(userData, null, 2));
      }
    })
    .catch((err) => {
      res.setHeader("Content-Type", "text/plain");
      res.status(500).send("Internal Server Error");
    });
});

//Read event with Price greater than p
app.get("/ev", (req, res) => {
  if (req.query.p === undefined) {
    Event.find({})
      .populate("venue")
      .then((data) => {
        const output = [];
        for (length in data) {
          output.push({
            eventId: data[length].eventId,
            title: data[length].title,
            venue: {
              venueId: data[length].venue.venueId,
              venueName: data[length].venue.venueName,
              lat: data[length].venue.lat,
              long: data[length].venue.long,
            },
            dateTime: data[length].dateTime,
            desc: data[length].desc,
            presenter: data[length].presenter,
            price: data[length].price,
          });
        }
        res.setHeader("Content-Type", "text/plain");
        res.status(200).send(JSON.stringify(output, null, 2));
      })
      .catch((err) => {
        res.setHeader("Content-Type", "text/plain");
        res.status(500).send("Internal Server Error");
      });
  } else {
    Event.find({ price: { $gte: req.query.p } })
      .populate("venue")
      .then((data) => {
        const output = [];
        for (length in data) {
          output.push({
            eventId: data[length].eventId,
            title: data[length].title,
            venue: {
              venueId: data[length].venue.venueId,
              venueName: data[length].venue.venueName,
              lat: data[length].venue.lat,
              long: data[length].venue.long,
            },
            dateTime: data[length].dateTime,
            desc: data[length].desc,
            presenter: data[length].presenter,
            price: data[length].price,
          });
        }
        res.setHeader("Content-Type", "text/plain");
        res.status(200).send(JSON.stringify(output, null, 2));
      })
      .catch((err) => {
        res.setHeader("Content-Type", "text/plain");
        res.status(500).send("Internal Server Error");
      });
  }
});

//Create Event data
app.post("/ev", (req, res) => {
  const venueId = req.body.venueId;
  Venue.findOne({ venueId: venueId })
    .then((venueData) => {
      Event.findOne({})
        .sort({ eventId: -1 })
        .limit(1)
        .then((data) => {
          const newMax = data.eventId + 1;
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
        });
    })
    .catch((err) => {
      res.setHeader("Content-Type", "text/plain");
      res.status(500).send("Internal Server Error");
    });
});

// Delete Event data
app.delete("/ev/:eventId", (req, res) => {
  Event.findOneAndDelete({ eventId: req.params.eventId })
    .then((data) => {
      if (data) {
        res.sendStatus(204);
      } else {
        res.setHeader("Content-Type", "text/plain");
        res.status(404).send("Event was not found, no event was deleted.");
        console.log("Event was not found, no event was deleted.");
      }
    })
    .catch((error) => {
      res.setHeader("Content-Type", "text/plain");
      res.status(500).send("Internal Server Error");
    });
});

// Delete User data
app.delete("/user/:userName", (req, res) => {
  LoginSchema.findOneAndDelete({ username: req.params.userName })
    .then((data) => {
      if (data) {
        res.sendStatus(204);
      } else {
        res.setHeader("Content-Type", "text/plain");
        res.status(404).send("Event was not found, no event was deleted.");
        console.log("Event was not found, no event was deleted.");
      }
    })
    .catch((error) => {
      res.setHeader("Content-Type", "text/plain");
      res.status(500).send("Internal Server Error");
    });
});

//Update Event Data
app.put("/ev/:eventId", (req, res) => {
  const newvenueId = req.body.venueId;
  Venue.findOne({ venueId: newvenueId }).then((NewVenueData) => {
    let NewVenueId = NewVenueData._id;
    let new_data = {
      title: req.body.title,
      venue: NewVenueData._id,
      dateTime: req.body.dateTime,
      desc: req.body.desc,
      presenter: req.body.presenter,
      price: req.body.price,
    };
    Event.findOneAndUpdate({ eventId: { $eq: req.body.eventId } }, new_data, { new: true })
      .populate("venue")
      .then((data) => {
        const NeweventData = {
          eventId: data.eventId,
          name: data.name,
          venue: {
            venueId: data.venue.venueId,
            venueName: data.venue.venueName,
            lat: data.venue.lat,
            long: data.venue.long,
          },
          dateTime: data.dateTime,
          desc: data.desc,
          presenter: data.presenter,
          price: data.price,
        };
        res.setHeader("Content-Type", "text/plain");
        res.status(200).send(JSON.stringify(NeweventData, null, 2));
      })
      .catch((error) => console.log(error));
  });
});

//Update Event Data
app.put("/ev/:eventId", (req, res) => {
  const newvenueId = req.body.venueId;
  Venue.findOne({ venueId: newvenueId }).then((NewVenueData) => {
    let NewVenueId = NewVenueData._id;
    let new_data = {
      title: req.body.title,
      venue: NewVenueData._id,
      dateTime: req.body.dateTime,
      desc: req.body.desc,
      presenter: req.body.presenter,
      price: req.body.price,
    };
    Event.findOneAndUpdate({ eventId: { $eq: req.body.eventId } }, new_data, { new: true })
      .populate("venue")
      .then((data) => {
        const NeweventData = {
          eventId: data.eventId,
          name: data.name,
          venue: {
            venueId: data.venue.venueId,
            venueName: data.venue.venueName,
            lat: data.venue.lat,
            long: data.venue.long,
          },
          dateTime: data.dateTime,
          desc: data.desc,
          presenter: data.presenter,
          price: data.price,
        };
        res.setHeader("Content-Type", "text/plain");
        res.status(200).send(JSON.stringify(NeweventData, null, 2));
      })
      .catch((error) => console.log(error));
  });
});

// listen to port 8000
const server = app.listen(8000);
