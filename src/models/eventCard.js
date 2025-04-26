const mongoose = require('mongoose');

const eventCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  paymentAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['captured', 'failed', 'pending'],
    default: 'pending'
  },
  cardIssuedAt: {
    type: Date,
    default: Date.now
  }
});


const EventCard = mongoose.models.EventCard || mongoose.model('EventCard', eventCardSchema);

module.exports = EventCard;
