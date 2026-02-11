const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEvent,
    createEvent,
    deleteEvent,
    updateEvent,
    getMyEvents,
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getEvents).post(protect, admin, createEvent);
router.get('/mine', protect, admin, getMyEvents);
router.route('/:id').get(getEvent).delete(protect, admin, deleteEvent).put(protect, admin, updateEvent);

module.exports = router;
