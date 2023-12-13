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
    type: String,
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
    type: Schema.Types.ObjectId,
    ref: "login",
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

const LoginSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  invitedEvents: { type: [Schema.Types.ObjectId], ref: "Invite", default: void 0 },
});

const InviteSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  users: { type: [Schema.Types.ObjectId], ref: "login", required: true, default: void 0, unique: true },
});

exports.EventSchema = EventSchema;
exports.LoginSchema = LoginSchema;
exports.CommentSchema = CommentSchema;
exports.VenueSchema = VenueSchema;
exports.InviteSchema = InviteSchema;
