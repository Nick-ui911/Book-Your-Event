const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date, // Event date (without time if you want)
    required: true
  },
  time: {
    type: String, // Like "5:00 PM"
    required: true
  },
  image:{
    type:String,
    
  },
  location: {
    type: String,
    required: true
  },
  address:{
    type:String,
    required:true
  },
  eventFee: {
    type: Number,
    default: 0 // Free event if not set
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
