const mongoose = require('mongoose');
mongoose.Promise = Promise;
const utils = require('./utils');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OffenceSchema = new Schema({
  id: Number,
  description: String,
  points: Number
});

const UserOffenceSchema = new Schema({
  id: Number,
  description: String,
  points: Number,
  timestamp: { type: Date, default: Date.now },
  submitter: String
});

const CheckInSchema = new Schema({
  pubName: String,
  timestamp: { type: Date, default: Date.now }
});

const UserSchema = new Schema({
  id: Number,
  name: String,
  imageURL: String,
  points: Number,
  offences: [UserOffenceSchema],
  checkIns: [CheckInSchema],
  key: String
});

module.exports.UserOffenceModel = mongoose.model('UserOffence', UserOffenceSchema)
module.exports.OffenceModel = mongoose.model('Offence', OffenceSchema)
module.exports.UserModel = mongoose.model('User', UserSchema)

mongoose.connection.on('error', function () {
  utils.log('Could not connect to the database. Exiting now...');
  process.exit();
});

mongoose.connection.once('open', function () {
  utils.log("Successfully connected to the database");
});

mongoose.connect('mongodb://localhost/glasgow-pubcrawl');
