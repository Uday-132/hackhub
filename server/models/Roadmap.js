const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    title: String,
    url: String,
    type: { type: String, enum: ['Video', 'Article', 'Interactive', 'Documentation', 'Book', 'Course'], default: 'Video' },
    duration: String,
    icon: { type: String, default: 'youtube' }
});

const TopicSchema = new mongoose.Schema({
    id: String,
    title: String,
    completed: { type: Boolean, default: false }
});

const MonthSchema = new mongoose.Schema({
    id: Number,
    title: String,
    subtitle: String,
    description: String,
    skills: [String],
    topics: [TopicSchema],
    resources: [ResourceSchema],
    status: { type: String, enum: ['locked', 'unlocked', 'completed'], default: 'unlocked' }
});

const RoadmapSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    goal: { type: String, required: true },
    months: [MonthSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
