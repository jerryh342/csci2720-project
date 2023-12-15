/*
I am submitting the assignment for: 
a group project on behalf of all members of the group. 
It is hereby confirmed that the submission is authorized by all members of the group, and all members of the group are required to sign this declaration. 
We declare that: 
(i) the assignment here submitted is original except for source material explicitly acknowledged/all members of the group have read and checked that all parts of the piece of work, 
irrespective of whether they are contributed by individual members or all members as a group, here submitted are original except for source material explicitly acknowledged; 
(ii) the piece of work, or a part of the piece of work has not been submitted for more than one purpose (e.g. to satisfy the requirements in two different courses) without declaration; and (iii) the submitted soft copy with details listed in the <Submission Details> is identical to the hard copy(ies), 
if any, which has(have) been / is(are) going to be submitted.  
We also acknowledge that I am/we are aware of the University’s policy and regulations on honesty in academic work, and of the disciplinary guidelines and procedures applicable to breaches of such policy and regulations, as contained in the University website http://www.cuhk.edu.hk/policy/academichonesty/. 
In the case of a group project, we are aware that all members of the group should be held responsible and liable to disciplinary actions, irrespective of whether he/she has signed the declaration and whether he/she has contributed, directly or indirectly, to the problematic contents.
We declare that we have not distributed/ shared/ copied any teaching materials without the consent of the course teacher(s) to gain unfair academic advantage in the assignment/ course.
We declare that we have read and understood the University’s policy on the use of AI for academic work.  we confirm that we have complied with the instructions given by my/our course teacher(s) regarding the use of AI tools for this assignment and consent to the use of AI content detection software to review my/our submission.
We also understand that assignments without a properly signed declaration by the student concerned and in the case of a group project, by all members of the group concerned, will not be graded by the teacher(s).

Signature(s):					        
HuenLongYin CheungHouLong LeungKaiKit ChanHonKi KwokLongChing 

Date:
15 December 2023

Name(s):							
Huen Long Yin Chan Hon Ki Cheung Hou Long Leung Kai Kit  Kwok Long Ching

Student ID(s):
1155159568 1155158959 1155149115 1155143874  1155156653

Course code:						
CSCI2720

Course title:
Building Web Applications

*/
const xml2js = require("xml2js");
const axios = require("axios");
const mongoose = require("mongoose");
const EventSchema = require("./schemas.js").EventSchema;
const VenueSchema = require("./schemas.js").VenueSchema;
const Event = mongoose.model("Event", EventSchema);
const Venue = mongoose.model("Venue", VenueSchema);

// mongoose.connect('mongodb://127.0.0.1:27017/project');
mongoose.connect("mongodb+srv://admin:admin@csci2720proj.pqtx7pq.mongodb.net/?retryWrites=true&w=majority"); // put your own database link here

const db = mongoose.connection;
// Upon connection failure
db.on("error", console.error.bind(console, "Connection error:"));

const getXML = async () => {
  const parser = new xml2js.Parser();
  try {
    const eventsResponse = await axios.get("https://www.lcsd.gov.hk/datagovhk/event/events.xml");
    const venuesResponse = await axios.get("https://www.lcsd.gov.hk/datagovhk/event/venues.xml");
    let event, venue;
    //get latest events and venues
    const eventsResult = await parser.parseString(eventsResponse.data, (err, result) => {
      event = result.events.event;
    });
    const locsResult = await parser.parseString(venuesResponse.data, (err, result) => {
      // console.log("result>>", result.venues.venue)
      venue = result.venues.venue;
    });

    const filteredEvent = event
      .filter(
        (i) =>
          i.$.id !== "" &&
          i.presenterorge[0] !== "" &&
          i.titlee[0] !== "" &&
          i.pricee[0] !== "" &&
          i.predateE[0] !== "" &&
          i.venueid[0] !== ""
      )
      .map((item) => ({
        eventId: parseInt(item.$.id),
        title: item.titlee[0],
        venue: parseInt(item.venueid[0]),
        dateTime: item.predateE[0],
        desc: item.desce[0] ? item.desce[0] : "N/A",
        presenter: item.presenterorge[0],
        price: item.pricee[0],
      }));

    // console.log("filteredEvent>>", filteredEvent)
    // Event.create(filteredEvent)
    //     .then((ven) => console.log("ven>>", ven))
    //     .catch((err) => console.log("err>>", err));
    // dont need to create except for the first time, if desc is undefined, add a 'N/A', other fields shouldnt be undefined

    const locationDict = {};
    for (i of event) {
      if (i.venueid[0] != "" && i.$.id != "") {
        if (locationDict[i.venueid[0]]) {
          locationDict[i.venueid[0]].push(i.$.id);
        } else {
          locationDict[i.venueid[0]] = [i.$.id];
        }
      }
    }
    //location dict to find an array of events in a give location, the events may contain N/A fields

    // console.log("locationDict>>", locationDict)

    const filteredLoc = venue
      .filter(
        (i) =>
          locationDict[i.$.id].length >= 3 &&
          i.venuee[0] !== "" &&
          i.latitude[0] !== "" &&
          i.longitude[0] !== "" &&
          i.$.id !== ""
      )
      .map((i) => ({
        venueId: parseInt(i.$.id),
        venueName: i.venuee[0],
        lat: parseFloat(i.latitude[0]),
        long: parseFloat(i.longitude[0]),
        lut: locationDict[i.$.id],
      }));
    // Venue.create(filteredLoc)
    //   .then((ven) => console.log("ven>>", ven))
    //   .catch((err) => console.log("err>>", err));
    // dont need to create except for the first time, filter the locations that have more than 3 events, ensure none of the field in locations are null, add a lookup table

    // Retrieve existing event and venue data from the database
    const existingEvents = await Event.find();
    const existingVenues = await Venue.find();

    // Check for updated events
    for (const event of filteredEvent) {
      const existingEvent = existingEvents.find((e) => e.eventId === event.eventId);
      if (!existingEvent) {
        console.log("create event");
        await Event.create(event);
      } else {
        // // Update the event if it exists in the database
        // if (event.title !== existingEvent.title || event.venue !== existingEvent.venue || event.dateTime !== existingEvent.dateTime || event.desc !== existingEvent.desc || event.presenter !== existingEvent.presenter || event.price !== existingEvent.price) {
        //   await Event.findByIdAndUpdate(existingEvent._id, event);
        // }
        console.log("exist event, skipping");
      }
    }

    // Check for updated venues
    for (const venue of filteredLoc) {
      const existingVenue = existingVenues.find((v) => v.venueId === venue.venueId);
      if (!existingVenue) {
        // Create a new venue if it doesn't exist in the database
        console.log("create venue");
        await Venue.create(venue);
      } else {
        // Update the venue if it exists in the database
        // if (venue.venueName !== existingVenue.venueName || venue.lat !== existingVenue.lat || venue.long !== existingVenue.long || venue.lut !==existingVenue.lut) {
        //   await Venue.findByIdAndUpdate(existingVenue._id, venue);
        // }
        console.log("exist veue, skipping");
      }
    }
    return true;
  } catch (error) {
    console.log("error>>", error);
    return error;
  }
};

module.exports = {
  getXML,
};
