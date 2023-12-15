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
const { ObjectId } = require("bson");
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
    type: Number,
    required: [true, "venue is required"],
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
  lut: {
    type: Array,
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
  invitations: { type: [Schema.Types.ObjectId], ref: "Invite", default: [] },
  role: { type: String, enum: ["admin", "user"], required: true, default: "user" },
  fav: { type: Array, required: true, default: [] },
});

const InviteSchema = new Schema({
  eventId: { type: Number, required: true, unique: true },
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  users: { type: [Schema.Types.ObjectId], ref: "login", default: [] },
});

const FavVenueSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "login" },
  venue: { type: Schema.Types.ObjectId, ref: "venue" },
});

exports.EventSchema = EventSchema;
exports.LoginSchema = LoginSchema;
exports.CommentSchema = CommentSchema;
exports.VenueSchema = VenueSchema;
exports.InviteSchema = InviteSchema;
exports.FavVenueSchema = FavVenueSchema;
