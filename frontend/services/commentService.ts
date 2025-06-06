// Comments service layer
import { fetchComments, fetchTopComments, createComment, voteOnComment, seedComments } from '../api/comments';
import type { CreateCommentRequest, VoteRequest, Comment } from '../api/comments';

export class CommentService {
  static async getComments(sortType: 'recent' | 'top', token?: string): Promise<Comment[]> {
    try {
      const comments = sortType === 'recent' 
        ? await fetchComments(token)
        : await fetchTopComments(token);
      return comments;
    } catch (error) {
      console.error('Fetch comments service error:', error);
      throw new Error('Failed to load comments. Please try again.');
    }
  }

  static async postComment(content: string, token?: string): Promise<Comment> {
    try {
      const newComment = await createComment({ content }, token);
      return newComment;
    } catch (error) {
      console.error('Create comment service error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to post comment. Please try again.');
    }
  }

  static async vote(commentId: string, voteType: 'upvote' | 'downvote', token: string): Promise<Comment> {
    try {
      const updatedComment = await voteOnComment(commentId, { voteType }, token);
      return updatedComment;
    } catch (error) {
      console.error('Vote service error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to vote. Please try again.');
    }
  }

  static async seedComments(token: string): Promise<void> {
    try {
      await seedComments(token);
    } catch (error) {
      console.error('Seed comments service error:', error);
      throw new Error('Failed to seed comments. Please try again.');
    }
  }
}
