# EXPRESS-TS-TODOOO

This is a simple Todo List API built with Express, TypeScript, and MongoDB. The application supports basic CRUD operations with authentication using JWT (access tokens and refresh tokens).

## Features

- **CRUD Operations**: Create, Read, Update, and Delete todos.
- **User Authentication**: User registration and login with JWT-based authentication.
- **Access & Refresh Tokens**: Secure routes with JWT access tokens, with support for refresh tokens.
- **Layered Architecture**: The app is organized with controllers, services, repositories, and middlewares for scalability and maintainability.

## Technologies Used

- **Express.js**: Web framework for Node.js.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **MongoDB**: NoSQL database for storing todos and user information.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT**: JSON Web Tokens for secure user authentication.
- **bcrypt**: Library for hashing passwords.
- **Docker**: Containerization platform for running the app in isolated environments.
- **pnpm**: Fast and disk space-efficient package manager.

## Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher.
- **Docker**: Ensure Docker is installed and running.
- **pnpm**: Preferred package manager.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/danidanz/express-ts-todooo.git
   cd express-ts-todooo
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set up environment variables (.env)**:

   ```bash
   MONGO_URI=your_mongodb_uri
   JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
   JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=300
   PORT=8000
   ```

4. **Build the TypeScript code**:

   ```bash
   pnpm build
   ```

### Running the Application

#### Using Node.js

1. **Start the development server**:

   ```bash
   pnpm dev
   ```

2. **API** will be available at `http://localhost:8000`.

#### Using Docker

1. **Build the Docker image**:

   ```bash
   docker build -t todo-list-api .
   ```

2. **Run the Docker container**:

   ```bash
   docker run -p 8000:8000 --env-file .env todo-list-api
   ```

3. **API** will be available at `http://localhost:8000`.

### API Endpoints

#### Authentication

- **POST `/api/auth/register`**: Register a new user.
- **POST `/api/auth/login`**: Login with email and password to receive tokens.
- **POST `/api/auth/refresh-token`**: Get a new access token using a refresh token.

#### Todos

- **GET `/api/todos`**: Get all todos for the authenticated user.
- **POST `/api/todos`**: Create a new todo.
- **GET `/api/todos/:id`**: Get a specific todo by its ID.
- **PUT `/api/todos/:id`**: Update a specific todo by its ID.
- **DELETE `/api/todos/:id`**: Delete a specific todo by its ID.

### Project Structure

```bash
/src
│
├── controllers
│   └── todoController.ts
│
├── services
│   └── todoService.ts
│
├── repositories
│   └── todoRepository.ts
│
├── routes
│   └── todoRoutes.ts
│
├── middlewares
│   └── authMiddleware.ts
│
├── models
│   ├── todo.ts
│   └── user.ts
│   └── refreshToken.ts
│
└── index.ts
```

### Additional Notes

- **Error Handling**: The app returns appropriate HTTP status codes and error messages.
- **Security**: Passwords are hashed using `bcrypt` before storage. JWT tokens are used for secure authentication.
- **Scalability**: The project is structured to support future expansion and scaling.

### DISCLAIMER

This API is not production-ready. It is intended for educational purposes or as a starting point for development. Before deploying to production, ensure that all security, scalability, and performance aspects are thoroughly reviewed and tested.

### License

This project is licensed under the MIT License.
