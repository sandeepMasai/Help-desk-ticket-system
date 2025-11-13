const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['open', 'in-progress', 'closed']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    trim: true
  }
}, { _id: true });

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'closed'],
    default: 'open',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  history: [historySchema]
}, {
  timestamps: true
});

// Add initial history entry when ticket is created
ticketSchema.pre('save', function(next) {
  if (this.isNew && this.history.length === 0) {
    this.history.push({
      status: this.status,
      priority: this.priority,
      updatedBy: this.userId,
      timestamp: new Date(),
      note: 'Ticket created'
    });
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);

