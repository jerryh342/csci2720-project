const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema({
  eventId: {
    type: Number,
    required: [true, "eventId is required"],
    unique: true,
  },
  //titlee
  title: {
    type: String,
    required: true,
  },
  //venueid
  venue: {
    type: Schema.Types.ObjectId,
    ref: "Venue",
    required: true,
  },
  //predatee
  dateTime: {
    type: String,
    required: true,
  },
  //desce
  desc: {
    type: String,
    required: true,
  },
  //presentere
  presenter: {
    type: String,
    required: true,
  },
  //pricee
  price: {
    type: Number,
    required: true,
  },
});

const VenueSchema = new Schema({
  venueId: {
    type: Number,
    required: [true, "venueId is required"],
    unique: true,
  },
  //venue
  venueName: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
});

const CommentSchema = Schema({
  user: {
    //TODO: UserSchema ObjectId
    type: String,
    required: true,
  },
  venueId: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

exports.EventSchema = EventSchema;
exports.CommentSchema = CommentSchema;
exports.VenueSchema = VenueSchema;
