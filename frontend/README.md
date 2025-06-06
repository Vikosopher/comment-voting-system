# Frontend – Comment Voting System

This is the frontend for the Comment Voting System, built with React, Vite, and Tailwind CSS.

---

## ✨ Features

- Modern, responsive UI with Tailwind CSS
- User authentication (login, signup, logout)
- Post, view, and vote on comments
- Optimistic UI for instant voting feedback
- "Newest" and "Top Voted" sorting
- Accessible and mobile-friendly
- Robust error handling and loading states

---

## 🛠️ Technologies

- React (with hooks and context)
- Vite (for fast dev/build)
- TypeScript
- Tailwind CSS

---

## 🚀 Setup & Run

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**
   - Create a `.env` file if you want to override the API URL:
     ```
     VITE_API_URL=http://localhost:5000/api
     ```

3. **Start the dev server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🧩 Folder Structure
```
frontend/
├── public/
├── src/
│ ├── api/         # API service files
│ ├── components/  # UI & Feature components
│ ├── config/      # API & app configurations
│ ├── contexts/    # Global state (Auth, Theme)
│ ├── hooks/       # Custom React hooks
│ ├── types/       # TypeScript type definitions
│ ├── utils/       # Reusable utilities (formatters, validators)
│ ├── styles/      # Global styles (index.css, theme.css)
│ ├── main.tsx     # Entry point
│ └── App.tsx      # Root App component
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```
## 🔗 API Integration

- All API calls are made to the backend (see root/README for endpoints).
- Uses `credentials: 'include'` for secure cookie-based auth.
- Handles token refresh automatically on app load.

---

## 🧑‍💻 Contributing

- Please lint and format your code before submitting PRs.
- UI/UX improvements are welcome!

---

## 📄 License

[MIT](../LICENSE)