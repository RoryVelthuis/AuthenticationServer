require('dotenv').config(); // Load environment variables
const express = require('express'); // Import express
const cors = require('cors'); // Import cors
const app = express(); // Create an express app
const parser = require('body-parser'); // Import body-parser
const authRoutes = require('./routes/auth'); // Import auth routes
const adminRoutes = require('./routes/admin')
const { verifyToken, checkRole } = require('./jwt') // Token verification
const logger = require('./logger'); // Import logger

const PORT = process.env.PORT || 3000; // Set the port

app.use(cors()); // Use cors
app.use(parser.json()); // Use JSON parser

// Log any requests
app.use((req, res, next) => {
    logger.info(`Request: ${req.method} ${req.url}`); // Log the request
    next();
});

// Use the auth routes
app.use('/auth', authRoutes) 

//Use the admin route
app.use('/admin', adminRoutes)


// User protected route
app.get('/protected', verifyToken, (req, res) => { // Protected route
    try {
        const user = req.user.username
        logger.info(`Protected route accessed by user ${ user }`);
        res.json({ message: 'This is a protected route', user: req.user });
    } catch (error) {
        logger.error('Error accessing protected route', { error: error.message });
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Admin protected route
app.get('/admin', verifyToken, checkRole('admin'), (req, res) => {
    try {
        const user = req.user.username;
        logger.info(`Admin route accessed by user ${user}`);
        res.json({ message: 'This is an admin route', user: req.user });
    } catch (error) {
        logger.error('Error acessing admin route', { error: error.message });
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})

// Start the server
app.listen(PORT, () => {
    logger.info(`Server running: http://localhost:${PORT}`);
});

// On server shutdown
process.on('SIGNINT', () => {
    logger.info('Server shutting down');
    process.exit(0);
})