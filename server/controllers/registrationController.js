const asyncHandler = require('express-async-handler');
const Registration = require('../models/registrationModel');

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private
const registerForEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.body;

    if (!eventId) {
        res.status(400);
        throw new Error('Event ID is required');
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
        user: req.user.id,
        event: eventId,
    });

    if (existingRegistration) {
        res.status(400);
        throw new Error('Already registered for this event');
    }

    const registration = await Registration.create({
        user: req.user.id,
        event: eventId,
    });

    res.status(201).json(registration);
});

// @desc    Get user registrations
// @route   GET /api/registrations
// @access  Private
const getRegistrations = asyncHandler(async (req, res) => {
    let query = {};

    if (req.user.role === 'admin' && req.query.all === 'true') {
        query = {};
    } else {
        query = { user: req.user.id };
    }

    const registrations = await Registration.find(query)
        .populate('event')
        .populate('user', 'name email');

    res.status(200).json(registrations);
});

module.exports = {
    registerForEvent,
    getRegistrations,
};
