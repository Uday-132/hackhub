const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        avatar: {
            type: String,
            default: '',
        },
        // Pathfinder Fields
        careerGoal: { type: String, default: '' },
        skillLevel: { type: String, default: 'Beginner' },
        targetOutcome: { type: String, default: '' },
        availability: { type: Number, default: 5 },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
