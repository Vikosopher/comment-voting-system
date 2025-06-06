import { useState, memo } from 'react';
import type { Comment } from '../api/comments';

interface CommentCardProps {
  comment: Comment;
  onVote: (commentId: string, voteType: 'upvote' | 'downvote') => Promise<void>;
  disableVoting?: boolean;
}

function CommentCard({ comment, onVote, disableVoting }: CommentCardProps) {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (isVoting || disableVoting) return;
    try {
      setIsVoting(true);
      await onVote(comment._id, voteType);
    } finally {
      setIsVoting(false);
    }
  };

  const isUpvoted = comment.userVote === 'upvote';
  const isDownvoted = comment.userVote === 'downvote';

  return (
    <article className="bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <span className="font-bold text-black px-2 py-1 rounded" style={{ background: '#FFFDE7' }}>
          {comment.content}
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleVote('upvote')}
          disabled={isVoting || disableVoting}
          aria-label={`Upvote (${comment.upvotes} votes)`}
          aria-pressed={isUpvoted}
          className={`flex items-center space-x-1 px-4 py-2 rounded-md font-bold transition-all duration-200
            ${isUpvoted ? 'text-green-700' : 'text-gray-700'}
            bg-green-100
            hover:bg-green-400 hover:text-green-900
            focus:outline-none focus:ring-2 focus:ring-green-300
            ${(isVoting || disableVoting) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          style={{ boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)' }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
          <span>{comment.upvotes}</span>
        </button>

        <button
          onClick={() => handleVote('downvote')}
          disabled={isVoting || disableVoting}
          aria-label={`Downvote (${comment.downvotes} votes)`}
          aria-pressed={isDownvoted}
          className={`flex items-center space-x-1 px-4 py-2 rounded-md font-bold transition-all duration-200
            ${isDownvoted ? 'text-red-700' : 'text-gray-700'}
            bg-red-100
            hover:bg-red-400 hover:text-red-900
            focus:outline-none focus:ring-2 focus:ring-red-300
            ${(isVoting || disableVoting) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          style={{ boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)' }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span>{comment.downvotes}</span>
        </button>

        <time 
          dateTime={comment.createdAt}
          className="text-sm text-gray-500"
        >
          {new Date(comment.createdAt).toLocaleDateString()}
        </time>
      </div>
    </article>
  );
}

export default memo(CommentCard);
