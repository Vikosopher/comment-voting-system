import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchComments, fetchTopComments, voteOnComment, seedComments } from '../api/comments';
import type { Comment } from '../api/comments';
import CommentCard from './CommentCard';
import LoadingSkeleton from './LoadingSkeleton';
import SortControls from './SortControls';

type SortOption = 'newest' | 'top';

export function CommentList({ newestComment }: { newestComment?: Comment | null }) {
  const { token, user } = useAuth();
  const [newestComments, setNewestComments] = useState<Comment[]>([]);
  const [topComments, setTopComments] = useState<Comment[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const seededRef = useRef(false);
  const initialLoad = useRef(true);

  // Load both newest and top comments
  useEffect(() => {
    const loadComments = async () => {
      try {
        if (initialLoad.current) {
          setLoading(true);
        }
        setError(null);
        
        // Load both lists in parallel
        const [newestData, topData] = await Promise.all([
          fetchComments(token || undefined),
          fetchTopComments(token || undefined)
        ]);

        setNewestComments(Array.isArray(newestData) ? newestData : []);
        setTopComments(Array.isArray(topData) ? topData : []);

        // If no comments and user is logged in, seed comments (only once)
        if (user && newestData.length === 0 && token && !seededRef.current) {
          seededRef.current = true;
          try {
            await seedComments(token);
            const [seededNewest, seededTop] = await Promise.all([
              fetchComments(token),
              fetchTopComments(token)
            ]);
            setNewestComments(Array.isArray(seededNewest) ? seededNewest : []);
            setTopComments(Array.isArray(seededTop) ? seededTop : []);
          } catch (e) {
            // ignore seed errors
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load comments');
      } finally {
        if (initialLoad.current) {
          setLoading(false);
          initialLoad.current = false;
        }
      }
    };

    loadComments();
  }, [token, user]);

  // Optimistically add newestComment to the top if not already present
  useEffect(() => {
    if (newestComment && newestComment._id && !newestComments.some(c => c._id === newestComment._id)) {
      setNewestComments(prev => [newestComment, ...prev]);
    }
  }, [newestComment, newestComments]);

  const handleVote = async (commentId: string | undefined, voteType: 'upvote' | 'downvote') => {
    if (!token || !commentId) return;

    const updateVotes = (comments: Comment[]) =>
      comments.map(comment => {
        if (comment._id !== commentId) return comment;

        let { upvotes, downvotes, userVote } = comment;

        if (userVote === voteType) {
          // Toggle off
          userVote = null;
          if (voteType === 'upvote') upvotes = Math.max(0, upvotes - 1);
          else downvotes = Math.max(0, downvotes - 1);
        } else if (!userVote) {
          // First time voting
          userVote = voteType;
          if (voteType === 'upvote') upvotes++;
          else downvotes++;
        } else {
          // Switching vote
          userVote = voteType;
          if (voteType === 'upvote') {
            upvotes++;
            downvotes = Math.max(0, downvotes - 1);
          } else {
            downvotes++;
            upvotes = Math.max(0, upvotes - 1);
          }
        }

        return { ...comment, upvotes, downvotes, userVote };
      });

    setNewestComments(prev => updateVotes(prev));
    setTopComments(prev => updateVotes(prev));

    try {
      const updatedComment = await voteOnComment(commentId, { voteType }, token);
      setNewestComments(prev =>
        prev.map(comment => (comment._id === updatedComment._id ? updatedComment : comment))
      );
      setTopComments(prev =>
        prev.map(comment => (comment._id === updatedComment._id ? updatedComment : comment))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote');
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
      </div>
    );
  }

  // Use the appropriate list based on sortBy
  const currentComments = sortBy === 'newest' ? newestComments : topComments;

  return (
    <div className="space-y-4">
      <SortControls sortBy={sortBy} onSortChange={setSortBy} />
      {currentComments.length === 0 ? (
        <div className="text-center text-black p-6 border-2 border-yellow-400 bg-yellow-50 rounded-lg font-semibold text-lg max-w-xl mx-auto">
          {user ? (
            <>Welcome, <span className="font-bold">{user.username}</span>!<br/>There are no comments yet. Be the first to share your thoughts and start the conversation!</>
          ) : (
            <>No comments yet. Be the first to comment!</>
          )}
        </div>
      ) : (
        currentComments.map(comment => (
          <CommentCard
            key={comment._id}
            comment={comment}
            onVote={sortBy === 'newest' ? (id, type) => handleVote(id, type) : async () => Promise.resolve()}
            disableVoting={sortBy !== 'newest'}
          />
        ))
      )}
    </div>
  );
} 