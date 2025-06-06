# 🗳️ Comment Voting System  

A **modern, secure, and full-stack** comment voting system built with **React, Node.js, and MongoDB**. This intuitive platform allows users to **post, vote, and engage** with comments dynamically. Optimized for performance and accessibility, it ensures a seamless user experience with **real-time voting feedback** and smart sorting.  

## 🚀 Features  

✅ **User Authentication** – Signup, login, logout, and session refresh  
🔥 **Vote on Comments** – Upvote/downvote with immediate UI updates  
🏆 **Smart Sorting** – View "Top Voted" and "Newest" comments dynamically  
💻 **Responsive & Accessible UI** – Styled with Tailwind CSS for smooth UX  
🔒 **Secure JWT-Based Auth** – HTTP-only cookie storage for refresh tokens  
⚡ **Robust Error Handling** – Covers edge cases and input validation  

## 💡 Why This Project?  

Discussions are more impactful when users can engage through voting and meaningful interactions. The **comment voting system** ensures **fairness and security**, preventing spam and manipulation while **highlighting valuable contributions**.  

Each user is allowed **only one vote per comment**, maintaining authenticity. Built-in sorting ensures top-rated conversations **naturally rise to prominence**, while newer perspectives remain discoverable.  

## 🔧 Tech Stack  

- **Frontend:** React, Vite, TypeScript, Tailwind CSS  
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT  
- **Other:** CORS, cookie-parser, bcryptjs, dotenv  

## 🚀 Getting Started  

### 1️. Clone the repository:**  
```bash
git clone https://github.com/your-username/comment-voting-system.git
cd comment-voting-system
```

### 2. Setup the backend
See [`backend/README.md`](./backend/README.md) for detailed instructions.

### 3. Setup the frontend
See [`frontend/README.md`](./frontend/README.md) for detailed instructions.

---

## 📦 Project Structure
```
comment-voting-system/
├── backend/ # Express API and MongoDB models
├── frontend/ # React app (Vite + Tailwind)
├── README.md # This file
└── LICENSE
```
---

## 🌐 API Structure

- **Auth:** `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout`, `/api/auth/refresh`
- **Comments:** `/api/comments`, `/api/comments/top`, `/api/comments/:id/vote`, `/api/comments/seed`

See backend README for full API details.
---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📝 License

[MIT](./LICENSE)

---

## Have ideas, feedback, or want to collaborate? I'm always open to discussions! Connect with me for feature suggestions, contributions, or just to chat about development. Let's make this project even better—your input matters!
