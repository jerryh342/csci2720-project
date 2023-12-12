const xml2js = require('xml2js');
const axios = require('axios')
const mongoose = require("mongoose");
const EventSchema = require("./schemas.js").EventSchema;
const VenueSchema = require("./schemas.js").VenueSchema;
const Event = mongoose.model("Event", EventSchema);
const Venue = mongoose.model("Venue", VenueSchema);


mongoose.connect("mongodb+srv://admin:admin@csci2720proj.pqtx7pq.mongodb.net/?retryWrites=true&w=majority"); // put your own database link here

const db = mongoose.connection;
// Upon connection failure
db.on("error", console.error.bind(console, "Connection error:"));

const getXML = async () =>{
    const parser = new xml2js.Parser()
    try {
        const eventsResponse = await axios.get('https://www.lcsd.gov.hk/datagovhk/event/events.xml');
        const venuesResponse = await axios.get('https://www.lcsd.gov.hk/datagovhk/event/venues.xml');
        let event, venue
        const eventsResult = await parser.parseString(eventsResponse.data, (err, result)=>{
            event = result.events.event        
        })
        const locsResult = await parser.parseString(venuesResponse.data, (err, result)=>{
           console.log("result>>", result.venues.venue)    
           venue=result.venues.venue
        })
       
        const filteredAndMappedVenue = venue.filter(i =>
            i.venuee[0] !== '' && i.latitude[0] !== '' && i.longitude[0] !== '' && i.$.id !== ''
        )
            .map(i => ({
            venueId: parseInt(i.$.id),
            venueName: i.venuee[0],
            lat: parseFloat(i.latitude[0]),
            long: parseFloat(i.longitude[0])
            }));

        console.log("filteredAndMappedVenue>>", filteredAndMappedVenue)
        // Venue.create(filteredAndMappedVenue)
        //     .then((ven) => console.log("ven>>", ven))
        //     .catch((err) => console.log("err>>", err));

        const locationDict = {}
        for (i of event) {
            if (i.presenterorge[0] !== '' && i.titlee[0] !== '' && i.pricee[0] !== '' && i.predateE[0] !== '' && i.venueid[0] !="" && i.desce[0] !="" && i.$.id[0]!="") {
                locationDict[i.venueid[0]]=(locationDict[i.venueid[0]] || 0) + 1;
            }
        }
        // console.log("loc>>", )
        const filteredArray = event.filter(item => locationDict[item.venueid] >= 3)
        .slice(0, 10)
        .map(item => ({
            eventId: item.$.id,
            title: item.titlee[0],
            venue: parseInt(item.venueid[0]),
            dateTime: item.predateE[0],
            desc: item.desce[0],
            presenter: item.presenterorge[0],
            price: item.pricee[0],                
          })); 
        //   Event.create(filteredArray)
        //   .then((ven) => console.log("ven>>", ven))
        //   .catch((err) => console.log("err>>", err));
          
          const getXML = async () =>{
    const parser = new xml2js.Parser()
    try {
        const eventsResponse = await axios.get('https://www.lcsd.gov.hk/datagovhk/event/events.xml');
        const venuesResponse = await axios.get('https://www.lcsd.gov.hk/datagovhk/event/venues.xml');
        let event, venue
        const eventsResult = await parser.parseString(eventsResponse.data, (err, result)=>{
            event = result.events.event        
        })
        const locsResult = await parser.parseString(venuesResponse.data, (err, result)=>{
           console.log("result>>", result.venues.venue)    
           venue=result.venues.venue
        })
       
        const filteredAndMappedVenue = venue.filter(i =>
            i.venuee[0] !== '' && i.latitude[0] !== '' && i.longitude[0] !== '' && i.$.id !== ''
        )
            .map(i => ({
            venueId: parseInt(i.$.id),
            venueName: i.venuee[0],
            lat: parseFloat(i.latitude[0]),
            long: parseFloat(i.longitude[0])
            }));

        console.log("filteredAndMappedVenue>>", filteredAndMappedVenue)
        // Venue.create(filteredAndMappedVenue)
        //     .then((ven) => console.log("ven>>", ven))
        //     .catch((err) => console.log("err>>", err));

        const locationDict = {}
        for (i of event) {
            if (i.presenterorge[0] !== '' && i.titlee[0] !== '' && i.pricee[0] !== '' && i.predateE[0] !== '' && i.venueid[0] !="" && i.desce[0] !="" && i.$.id[0]!="") {
                locationDict[i.venueid[0]]=(locationDict[i.venueid[0]] || 0) + 1;
            }
        }
        // console.log("loc>>", )
        const filteredArray = event.filter(item => locationDict[item.venueid] >= 3)
        .slice(0, 10)
        .map(item => ({
            eventId: item.$.id,
            title: item.titlee[0],
            venue: parseInt(item.venueid[0]),
            dateTime: item.predateE[0],
            desc: item.desce[0],
            presenter: item.presenterorge[0],
            price: item.pricee[0],                
          })); 
        //   Event.create(filteredArray)
        //   .then((ven) => console.log("ven>>", ven))
        //   .catch((err) => console.log("err>>", err));
        // Retrieve existing event and venue data from the database

    const existingEvents = await Event.find();
    const existingVenues = await Venue.find();

    // Check for updated events
    for (const event of filteredArray) {
      const existingEvent = existingEvents.find(e => e.eventId === event.eventId);
      if (existingEvent) {
        // Update the event if it exists in the database
        if (event.title !== existingEvent.title || event.venue !== existingEvent.venue || event.dateTime !== existingEvent.dateTime || event.desc !== existingEvent.desc || event.presenter !== existingEvent.presenter || event.price !== existingEvent.price) {
          await Event.findByIdAndUpdate(existingEvent._id, event);
        }
      } else {
        console.log("create")
        // Create a new event if it doesn't exist in the database
        await Event.create(event);
      }
    }

    // Check for updated venues
    for (const venue of filteredAndMappedVenue) {
      const existingVenue = existingVenues.find(v => v.venueId === venue.venueId);
      if (existingVenue) {
        // Update the venue if it exists in the database
        if (venue.venueName !== existingVenue.venueName || venue.lat !== existingVenue.lat || venue.long !== existingVenue.long) {
          await Venue.findByIdAndUpdate(existingVenue._id, venue);
        }
      } else {
        // Create a new venue if it doesn't exist in the database
        await Venue.create(venue);
      }
    }
    console.log("filteredArray>>", filteredArray)
    return filteredArray;
        
      
    } catch (error) {
        console.log("error>>", error)
        return error
    }
    

}
        
      
    } catch (error) {
        console.log("error>>", error)
        return error
    }
    

}
module.exports ={
    getXML,
}
