const fs = require('fs');
const USERS_FILE = 'users.json';

// Function to read users from file
const readUsersFromFile = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to write users to file
const writeUsersToFile = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing to file:', error);
    }
}

module.exports = {
    readUsersFromFile,
    writeUsersToFile
}
