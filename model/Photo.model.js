const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
