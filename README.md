# Authentication Server

This is a simple authentication server built with Node.js, Express, and JWT for token-based authentication.

## Features

- User registration and login
- Password hashing with bcrypt
- Token-based authentication with JWT
- Input validation with express-validator
- Logging with winston


### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd AuthenticationServer
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/9) file in the root directory and add the following:
    ```
    PORT=3000
    JWT_SECRET='your_jwt_secret'
    ```

4. Start the server:
    ```sh
    npm run dev
    ```

## API Endpoints

### Authentication

- **POST /auth/login**
    - Request body: `{ "username": "your_username", "password": "your_password" }`
    - Response: `{ "message": "Login successful", "token": "your_jwt_token" }`

- **POST /auth/register**
    - Request body: `{ "username": "your_username", "password": "your_password" }`
    - Response: `{ "message": "User created" }`

### Protected Route

- **GET /protected**
    - Headers: `{ "Authorization": "Bearer your_jwt_token" }`
    - Response: `{ "message": "This is a protected route", "user": "your_username" }`

## License

This project is licensed under the MIT License.