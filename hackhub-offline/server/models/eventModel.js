const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
        date: {
            type: Date,
            required: [true, 'Please add a date'],
        },
        tech_stack: {
            type: [String],
            required: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Event', eventSchema);
