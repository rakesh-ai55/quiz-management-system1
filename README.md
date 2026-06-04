# Quiz Management System

A full-stack Quiz Management System built with the MERN stack (MongoDB, Express, React-like HTML/JS frontend, Node.js). It supports user registration, JWT authentication, timed quizzes, result tracking, and an admin panel for managing quizzes and questions.

## Features

### User Features
- User Registration and Login with JWT authentication
- View available quizzes
- Attempt timed MCQ quizzes
- Submit and get instant score
- View previous results and answer review

### Admin Features
- Admin login
- Create, edit, and delete quizzes
- Add, edit, and delete questions for each quiz
- View all registered users
- View all quiz results

### Extra Features
- Timer-based quiz with auto-submit
- Score calculation with percentage
- Answer review after submission
- Leaderboard support (API ready)
- Responsive UI design

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcryptjs

## Project Structure

```
quiz-management-system/
  backend/
    config/
      db.js
    controllers/
      authController.js
      userController.js
      quizController.js
      questionController.js
      resultController.js
    middleware/
      auth.js
      errorHandler.js
    models/
      User.js
      Quiz.js
      Question.js
      Result.js
    routes/
      auth.js
      users.js
      quizzes.js
      questions.js
      results.js
    .env.example
    package.json
    seed.js
    server.js
  frontend/
    css/
      styles.css
    js/
      api.js
      auth.js
      dashboard.js
      quiz.js
      result.js
      admin.js
    index.html
    dashboard.html
    quiz.html
    result.html
    admin.html
  README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)

## Setup Instructions

### 1. Clone or Extract the Project

Place the project folder anywhere on your system.

### 2. Install Backend Dependencies

Open a terminal in the `backend` folder and run:

```bash
npm install
```

### 3. Configure Environment Variables

In the `backend` folder, create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quiz_management
JWT_SECRET=your_super_secret_key_here
```

- If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.
- Change `JWT_SECRET` to a strong random string.

### 4. Seed Sample Data (Optional)

To populate the database with sample quizzes, questions, users, and results:

```bash
npm run seed
```

Sample credentials after seeding:
- **Admin:** `admin@quiz.com` / `admin123`
- **User:** `john@example.com` / `user123`

### 5. Start the Backend Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start at `http://localhost:5000`.

### 6. Open the Frontend

Open the `frontend/index.html` file directly in your browser, or use a simple static server:

```bash
# If you have Python installed
python -m http.server 5500 --directory ../frontend

# Or with Node.js npx serve
npx serve ../frontend
```

Then visit `http://localhost:5500` (or open `index.html` directly).

## API Endpoints

| Endpoint | Method | Description | Auth |
|---|---|---|---|
| `/api/auth/register` | POST | Register a new user | No |
| `/api/auth/login` | POST | Login user | No |
| `/api/auth/me` | GET | Get current user | Yes |
| `/api/users` | GET | Get all users (admin) | Admin |
| `/api/quizzes` | GET | Get all quizzes | Yes |
| `/api/quizzes/:id` | GET | Get single quiz | Yes |
| `/api/quizzes` | POST | Create quiz | Admin |
| `/api/quizzes/:id` | PUT | Update quiz | Admin |
| `/api/quizzes/:id` | DELETE | Delete quiz | Admin |
| `/api/questions/quiz/:quizId` | GET | Get questions by quiz | Yes |
| `/api/questions` | POST | Create question | Admin |
| `/api/questions/:id` | PUT | Update question | Admin |
| `/api/questions/:id` | DELETE | Delete question | Admin |
| `/api/results/submit` | POST | Submit quiz attempt | Yes |
| `/api/results/myresults` | GET | Get my results | Yes |
| `/api/results/all` | GET | Get all results (admin) | Admin |
| `/api/results/leaderboard/:quizId` | GET | Get leaderboard | Yes |
| `/api/results/:id` | GET | Get result details | Yes |

## How to Use

1. Open the frontend in your browser.
2. **Register** a new account or **Login** with existing credentials.
3. On the **Dashboard**, browse available quizzes.
4. Click **Start Quiz** to begin a timed quiz.
5. Select answers and click **Submit Quiz** (or let the timer auto-submit).
6. View your **score and answer review** immediately.
7. Visit **My Results** from the navigation to see history.
8. **Admins** are redirected to the **Admin Panel** where they can manage quizzes, questions, users, and results.

## Notes

- The frontend uses vanilla JavaScript with Fetch API.
- CORS is enabled on the backend for local development.
- Passwords are hashed with bcrypt before storage.
- JWT tokens are stored in `localStorage` and sent with each API request.

## License

This project is for educational and mini-project submission purposes.
