const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure user can only save a property once
savedSchema.index({ user: 1, property: 1 }, { unique: true });

module.exports = mongoose.model('Saved', savedSchema);
