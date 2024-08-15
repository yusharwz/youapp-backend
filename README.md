# YouApp Backend API Documentation

This documentation provides an overview of the API endpoints for the YouApp Backend. The API is designed to handle user registration, login, profile management, and messaging functionalities.

## Installation

### 1. Clone the repository:

```bash
git clone https://github.com/yusharwz/youapp-backend.git
cd youapp-backend
```

### 2. Install the dependencies:

```bash
npm install
```

## Environment Variables

Create a .env file in the root of the project and add your MongoDB connection string:

\`\`\`
MONGODB_URI=<your_mongodb_uri>
\`\`\`

## Running the Application

To start the application, use the following command:

```bash
npm run start
```

The application will be running on \`http://localhost:3000\`.

## Base URL

The base URL for the API is:

```
http://localhost:3000/api
```

## Authentication

Most endpoints require a Bearer Token for authentication. You must include the token in the `Authorization` header as follows:

```
Authorization: Bearer {token}
```

## Endpoints

### 1. Register

- **URL**: `/register`
- **Method**: `POST`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "email": "example@example.com",
    "username": "exampleUser",
    "password": "ExamplePassword123!"
  }
  ```
- **Response**:
  - Success: `201 Created`
  - Failure: `400 Bad Request`

### 2. Login

- **URL**: `/login`
- **Method**: `POST`
- **Description**: Logs in an existing user and returns a JWT token.
- **Request Body**:
  ```json
  {
    "email": "example@example.com",
    "password": "ExamplePassword123!"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here"
  }
  ```
  - Success: `200 OK`
  - Failure: `401 Unauthorized`

### 3. Get Profile

- **URL**: `/getProfile`
- **Method**: `GET`
- **Description**: Retrieves the profile of the authenticated user.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer {token}"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "exampleUserId",
    "email": "example@example.com",
    "username": "exampleUser",
    "password": "hashedPassword",
    "displayName": "exampleUser",
    "gender": "male",
    "birthDate": "2000-01-01",
    "horoscope": "♉ horoscope",
    "zodiac": "zodiac",
    "height": 170,
    "weight": 70,
    "interests": ["Reading", "Gaming"]
  }
  ```

### 4. Update User

- **URL**: `/updateUser`
- **Method**: `PUT`
- **Description**: Updates the authenticated user's details.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer {token}"
  }
  ```
- **Request Body**:
  ```json
  {
    "email": "newemail@example.com",
    "username": "newUsername",
    "password": "NewPassword123!"
  }
  ```
- **Response**:
  - Success: `200 OK`
  - Failure: `400 Bad Request`

### 5. Create Profile

- **URL**: `/createProfile`
- **Method**: `POST`
- **Description**: Creates a new profile for the authenticated user.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer {token}"
  }
  ```
- **Request Body**:
  ```json
  {
    "displayName": "exampleUser",
    "gender": "male",
    "birthDate": "2000-01-01",
    "height": 170,
    "weight": 70,
    "interests": ["Reading", "Gaming"]
  }
  ```
- **Response**:
  - Success: `201 Created`
  - Failure: `400 Bad Request`

### 6. Update Profile

- **URL**: `/updateProfile`
- **Method**: `PUT`
- **Description**: Updates the profile of the authenticated user.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer {token}"
  }
  ```
- **Request Body**:
  ```json
  {
    "displayName": "newDisplayName",
    "gender": "female",
    "birthDate": "2000-01-01",
    "height": 165,
    "weight": 60,
    "interests": ["Music", "Sports"]
  }
  ```
- **Response**:
  - Success: `200 OK`
  - Failure: `400 Bad Request`

### 7. Delete Profile

- **URL**: `/deleteProfile`
- **Method**: `DELETE`
- **Description**: Deletes the authenticated user's profile.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer {token}"
  }
  ```
- **Response**:
  - Success: `200 OK`
  - Failure: `400 Bad Request`

### 8. Send Message

- **URL**: `/sendMessage`
- **Method**: `POST`
- **Description**: Sends a message to another user.
- **Headers**:

```json
{
  "Authorization": "Bearer {token}"
}
```

- **Request Body**:
  ```json
  {
    "receiverId": "receiverId_here",
    "content": "Hello there!"
  }
  ```
- **Response**:
  - Success: `201 Created`
  - Failure: `400 Bad Request`

### 9. Get Message

- **URL**: `/viewMessage/{receiverId}`
- **Method**: `GET`
- **Description**: Retrieves the messages exchanged with a specific user.
- **Headers**:

```json
{
  "Authorization": "Bearer {token}"
}
```

- **Response**:
  ```json
  [
    {
      "senderId": "senderId_here",
      "receiverId": "receiverId_here",
      "content": "Hello there!",
      "timestamp": "2024-08-15T00:13:24.204Z"
    },
    ...
  ]
  ```

### 10. Get All Chat Rooms

- **URL**: `/viewAllMessages`
- **Method**: `GET`
- **Description**: Retrieves all chat rooms the authenticated user is part of.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer {token}"
  }
  ```
- **Response**:
  ```json
  [
    {
      "userId": "exampleFirstUserId",
      "username": "exampleFirstUsername"
    },
    {
      "userId": "exampleSecondUserId",
      "username": "exampleSecondUsername"
    }
  ]
  ```

## Notes

- Ensure that all requests requiring authentication include the Bearer token in the headers.
- Update your environment variables accordingly to handle dynamic values like tokens.
