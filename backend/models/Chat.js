const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['user', 'bot', 'admin'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    metadata: {
        type: Map,
        of: String
    }
});

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: 'New Conversation'
    },
    messages: [messageSchema],
    context: {
        type: Map,
        of: String,
        default: {}
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'archived'],
        default: 'active'
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    endedAt: {
        type: Date
    },
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            maxlength: 500
        }
    }
});

// Indexes for faster queries
chatSchema.index({ user: 1 });
chatSchema.index({ sessionId: 1 });
chatSchema.index({ status: 1 });
chatSchema.index({ lastMessageAt: -1 });

// NO pre-save middleware to avoid "next is not a function" error

module.exports = mongoose.model('Chat', chatSchema);
