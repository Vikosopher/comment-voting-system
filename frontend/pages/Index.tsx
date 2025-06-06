import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { AuthService } from "@/services/authService";
import { CommentService } from "@/services/commentService";
import AuthForm from "@/components/AuthForm";
import Header from "@/components/Header";
import SortControls from "@/components/SortControls";
import NewCommentForm from "@/components/NewCommentForm";
import CommentCard from "@/components/CommentCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

interface Comment {
  _id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  userVote?: "upvote" | "downvote" | null;
}

type SortType = "recent" | "top";

const Index = () => {
  const { user, token, isLoading: authLoading, login, logout } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [sortType, setSortType] = useState<SortType>("recent");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && token) {
      fetchComments();
    }
  }, [user, token, sortType]);

  const fetchComments = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const fetchedComments = await CommentService.getComments(sortType, token);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch comments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await AuthService.login({ email, password });
      login(response.user, response.accessToken);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description:
          error instanceof Error
            ? error.message
            : "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSignup = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      const response = await AuthService.signup({ email, password, username });
      login(response.user, response.accessToken);
      toast({
        title: "Account Created!",
        description: "Welcome to the comment voting system.",
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create account. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setComments([]);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNewComment = async (content: string) => {
    if (!token) return;

    try {
      const newComment = await CommentService.postComment(content, token);
      setComments((prev) => [newComment, ...prev]);
      toast({
        title: "Comment Posted!",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to post comment. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleVote = async (commentId: string, voteType: "up" | "down") => {
    if (!token) return;

    try {
      const updatedComment = await CommentService.vote(
        commentId,
        voteType === "up" ? "upvote" : "downvote",
        token
      );

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        )
      );
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
        <AuthForm onLogin={handleLogin} onSignup={handleSignup} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <Header user={user} onLogout={handleLogout} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <SortControls sortType={sortType} onSortChange={setSortType} />

        <div className="mb-8">
          <NewCommentForm onSubmit={handleNewComment} />
        </div>

        <div className="space-y-4">
          {loading ? (
            <LoadingSkeleton />
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No comments yet</div>
              <div className="text-gray-500">
                Be the first to share your thoughts!
              </div>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentCard
                key={comment._id}
                comment={{
                  id: comment._id,
                  content: comment.content,
                  author: "Anonymous", // No author as per your requirement
                  authorId: "anonymous",
                  createdAt: comment.createdAt,
                  upvotes: comment.upvotes,
                  downvotes: comment.downvotes,
                  userVote:
                    comment.userVote === "upvote"
                      ? "up"
                      : comment.userVote === "downvote"
                      ? "down"
                      : null,
                }}
                onVote={handleVote}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
