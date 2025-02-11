const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { validateLogin, validateRegistration, validate } = require('../validators');
const { readUsersFromFile, writeUsersToFile } = require('../users');
const { generateToken } = require('../jwt');
const logger = require('../logger');

// Login endpoint
router.post('/login', validateLogin, validate, async (req, res) => {
    try {
        const { username, password } = req.body;
        logger.info(`Login attempt with credential: ${ username }`);

        // Read users from file
        const users = readUsersFromFile();
    
        // Find the user by username
        const user = users.find(user => user.username === username)
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        
        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
    
        // Respond with success message
        logger.info(`Login successful by user: ${ username }`);
        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        logger.info('Error logging in', { error: error.message });
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}) 


// Register endpoint
router.post('/register', validateRegistration, validate, async (req, res) => {
    try {
        const { username, password } = req.body;
        logger.info('Registration attempt', { username });

        // Read users from file
        const users = readUsersFromFile();

        // Check if username exists
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword }); // Add user to the list

        // Write users to file
        writeUsersToFile(users);
    
        // Respond with success message
        logger.info('Registration Success', { username });
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        logger.info('Error registering user', { error: error.message });
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})

module.exports = router;