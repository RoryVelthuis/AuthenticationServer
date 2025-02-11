const { body, validationResult } = require('express-validator');

// Rules for validating registration request
const validateRegistration = [
    body('username') // Middleware to validate username
        .isString().withMessage('Username must be a string')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .isAlphanumeric().withMessage('Username must contain only letters and numbers'),
    body('password') // Middleware to validate the password
        .isString().withMessage('Password must be a string')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .not().matches(/\s/).withMessage('Password must not contain spaces'),
]

// Rules for validating login request
const validateLogin = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
];


// Function to validate the request body
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateLogin,
    validateRegistration,
    validate
}