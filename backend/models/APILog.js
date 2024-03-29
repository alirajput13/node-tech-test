const mongoose = require('mongoose');

const apiLogSchema = new mongoose.Schema({
  method: String,
  url: String,
  statusCode: Number,
  responseTime: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('APILog', apiLogSchema);