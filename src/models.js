const mongoose = require('mongoose');
const utils = require('./utils');

mongoose.Promise = Promise;
const Schema = mongoose.Schema;

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

module.exports.UserOffenceModel = mongoose.model('UserOffence', UserOffenceSchema);
module.exports.OffenceModel = mongoose.model('Offence', OffenceSchema);
module.exports.UserModel = mongoose.model('User', UserSchema);

mongoose.connect('mongodb://localhost/pubcrawl', { useNewUrlParser: true })
  .then(() => utils.log("Successfully connected to the database"))
  .catch(() => {
    utils.log('Could not connect to the database. Exiting now...');
    process.exit();
  });
