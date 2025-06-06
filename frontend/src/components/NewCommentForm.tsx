import { useState, memo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createComment } from '../api/comments';
import { useEffect } from 'react';

function NewCommentForm({ onCommentPosted }: { onCommentPosted?: (comment: any) => void }) {
  const { token } = useAuth();
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !token) return;

    try {
      setLoading(true);
      setError(null);
      const newComment = await createComment({ content: content.trim() }, token);
      setContent("");
      setIsExpanded(false);
      if (onCommentPosted) onCommentPosted(newComment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comment');
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setContent("");
    setIsExpanded(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-lg">
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <textarea
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleFocus}
              className={`w-full resize-none transition-all duration-300 rounded-md border-gray-300 text-black bg-gray-50 focus:bg-white focus:border-yellow-400 focus:ring-yellow-300 ${
                isExpanded ? "min-h-[120px]" : "min-h-[60px]"
              }`}
              rows={isExpanded ? 5 : 2}
              aria-label="Comment content"
            />

            {isExpanded && (
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span
                  className={`${content.length > 500 ? "text-red-500" : ""}`}
                  aria-live="polite"
                >
                  {content.length}/500
                </span>
                <span className="text-xs">Shift + Enter for new line</span>
              </div>
            )}
          </div>

          {isExpanded && (
            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-3 py-2 text-sm bg-red-200 text-black font-bold rounded hover:bg-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!content.trim() || content.length > 500 || loading}
                className="px-3 py-2 text-sm font-bold text-black bg-green-100 hover:bg-green-400 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Post Comment
                  </span>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm mb-4" role="alert">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default memo(NewCommentForm);
