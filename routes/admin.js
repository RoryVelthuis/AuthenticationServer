const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { readUsersFromFile, writeUsersToFile } = require('../users');
const { verifyToken, checkRole } = require('../jwt');
const logger = require('../logger');

// Update user role endpoint
router.put('/update-role', verifyToken, checkRole('admin'), [
    check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    check('role').isIn(['user', 'admin']).withMessage('Role must be either user or admin')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation errors', { errors: errors.array() });
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, role } = req.body;
    logger.info(`Role update attempt: '${username}' to '${role}'`);

    try {
        // Read users from file
        const users = readUsersFromFile();

        // Find the user by username
        const user = users.find(user => user.username === username);
        if (!user) {
            logger.error('User not found', { username });
            return res.status(404).json({ message: 'User not found' });
        }

        if(user.role === role) {
            logger.info('User already has the role', { username, role });
            return res.status(200).json({ message: 'User already has the role', user });
        }

        // Update the user's role
        user.role = role;

        // Write users to file
        writeUsersToFile(users);

        // Respond with success message
        logger.info('Role update success', { username, role });
        res.status(200).json({ message: 'User role updated', user });
    } catch (error) {
        logger.error('Error updating user role', { error: error.message });
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;