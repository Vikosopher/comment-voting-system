import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import AuthForm from './components/AuthForm';
import { CommentList } from './components/CommentList';
import NewCommentForm from './components/NewCommentForm';
import { ToastProvider, ToastContainer } from './components/Toast';
import { Fragment, useState } from 'react';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function Footer() {
  return (
    <footer className="w-full flex justify-center py-6">
      <span className="font-bold text-xl text-black px-8 py-4 rounded relative z-10" style={{
        textShadow: '0 0 16px #fde047, 0 0 12px #fde047',
        background: 'rgba(255,255,0,0.10)',
      }}>
        Share your thoughts, upvote insightful comments, and join a vibrant community!
      </span>
    </footer>
  );
}

function App() {
  const location = useLocation();
  const isLoginOrSignup = location.pathname === '/login' || location.pathname === '/signup';
  const [newestComment, setNewestComment] = useState<any>(null);

  return (
    <ToastProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Header />
          <main className="container mx-auto px-4 py-8 flex-1">
            <Routes>
              <Route path="/login" element={<><AuthForm />{isLoginOrSignup && <Footer />}</>} />
              <Route path="/signup" element={<><AuthForm isSignup />{isLoginOrSignup && <Footer />}</>} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <div className="space-y-8">
                      <NewCommentForm onCommentPosted={setNewestComment} />
                      <CommentList newestComment={newestComment} />
                    </div>
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
