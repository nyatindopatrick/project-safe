const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const SaccoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  uniqueSaccoCode: {
    type: String,
    required: true,
  },
  address: {
    type: String,

  },
  postal_code: {
    type: Number,
  },
  registration_number: {
    type: String,
    required: true,
    unique: true,
  },

  telephone_number: {
    type: String,
    required: true,
    unique: true,
  },
  membership: String,
  date_founded: {
    type: String,
    required: true,
  },

  description: String,
  website: {
    type: String,
  },
  created: {
    type: String,
    required: true
  },
  saccoLeaderFname: {
    type: String,
    requred: true,
  },
  saccoLeaderLname: {
    type: String,
    requred: true,
  },
  saccoLeaderPhoneNumber: {
    type: String,
    requred: true,
  },
  status: {
    type: String,
    default: 'Active',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },

  date: {
    type: Date,
    default: Date.now()
  }
});

const smsSchema = new mongoose.Schema({
  text: {
    type: String
  },
  from: {
    type: Number
  },
  time: {
    type: Date,
    default: Date.now()
  }
})

const User = mongoose.model('User', UserSchema);
const Sacco = mongoose.model('Sacco', SaccoSchema);
const Sms = mongoose.model('Sms', smsSchema);

module.exports = { User, Sacco, Sms };
