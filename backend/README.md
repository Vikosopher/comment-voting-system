# Backend – Comment Voting System

This is the backend API for the Comment Voting System, built with Node.js, Express, and MongoDB.

---

## ✨ Features

- User authentication (JWT access & refresh tokens)
- Secure password hashing (bcryptjs)
- Comment posting, listing, and voting (upvote/downvote)
- User-specific vote tracking (prevents duplicate/conflicting votes)
- CORS and cookie security for frontend integration
- Robust error handling

---

## 🛠️ Technologies

- Node.js, Express
- MongoDB, Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- cookie-parser, cors, dotenv

---

## 🚀 Setup & Run

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   - Create a `.env` file with:
     ```
     MONGO_URI=mongodb://localhost:27017/comment-voting
     ACCESS_TOKEN_SECRET=your_access_secret
     REFRESH_TOKEN_SECRET=your_refresh_secret
     FRONTEND_URL=http://localhost:3000
     ```

3. **Start the server:**
   ```bash
   npm run dev
   ```
   The API will be available at [http://localhost:5000/api](http://localhost:5000/api).

---

## 📚 API Endpoints

- **Auth**
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET  /api/auth/refresh`
- **Comments**
  - `GET    /api/comments` (newest)
  - `GET    /api/comments/top` (top voted)
  - `POST   /api/comments` (create)
  - `POST   /api/comments/:id/vote` (vote)
  - `POST   /api/comments/seed` (seed mock comments)

---

## 🔒 Special Features

- **Voting Logic:**  
  Each user can only upvote or downvote a comment once. Toggling or switching votes updates counts accordingly.
- **Session Security:**  
  Refresh tokens are stored in HTTP-only cookies for security.
- **CORS:**  
  Configured for secure cross-origin requests with credentials.

---

## 🧑‍💻 Contributing

- Please follow best practices for API design and security.
- Open issues or PRs for improvements.

---

## 📄 License

[MIT](../LICENSE)