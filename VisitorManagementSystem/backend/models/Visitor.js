const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  aadharNumber: {
    type: String,
    required: true,
    unique: true
  },
  aadharLastFour: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  hostName: {
    type: String,
    required: true
  },
  hostPhone: {
    type: String,
    required: true
  },
  qrCode: {
    type: String,
    unique: true
  },
  qrCodeImage: {
    type: String
  },
  isInside: {
    type: Boolean,
    default: false
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  expectedReturnTime: {
    type: Date
  },
  hasReturnConsent: {
    type: Boolean,
    default: false
  },
  visits: [{
    checkInTime: Date,
    checkOutTime: Date,
    expectedReturnTime: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Visitor', visitorSchema);

