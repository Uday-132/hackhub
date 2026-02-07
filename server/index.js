const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Robust CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'https://hackhub-alpha.vercel.app', 'http://localhost:5000', 'https://hackhub-fzumh2e5u-uday-132s-projects.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'Server is running', env: process.env.NODE_ENV });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));

// Global Error Handler
app.use(errorHandler);

// Export the app for Vercel
module.exports = app;

// Only listen if not running on Vercel (local development)
if (require.main === module) {
    app.listen(port, () => console.log(`Server started on port ${port}`));
}
