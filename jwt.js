const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = { username: user.username };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
}

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']; // Get the token from the headerd
    if (!token) {
        return res.status(403).json({ message: 'No token provided' }); // If no token is provided, return a error message
    }

    const tokenParts = token.split(' '); // Split the token into parts to removed the Bearer keyword
    if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
        return res.status(403).json({ message: 'Invalid token format' }); // If the token format is invalid, return a error message
    }

    // Verify the token
    jwt.verify(tokenParts[1], process.env.JWT_SECRET, (err, decoded) => { // decoded is the payload
        if (err) {
            return res.status(401).json({ message: 'Invalid Token' }); // If token is invalid, return a message
        }
        req.user = decoded; // Set the user in the request object
        next();
    });
};


module.exports = {
    generateToken,
    verifyToken
}