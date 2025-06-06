const Comment = require("../models/comment.model");
const Vote = require("../models/vote.model");

exports.voteOnComment = async (userId, commentId, voteType) => {
  if (!["upvote", "downvote"].includes(voteType)) {
    throw new Error("Invalid vote type");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  const existingVote = await Vote.findOne({ user: userId, comment: commentId });

  // Case 1: No existing vote → add new vote
  if (!existingVote) {
    await Vote.create({ user: userId, comment: commentId, voteType });

    if (voteType === "upvote") comment.upvotes++;
    else comment.downvotes++;
  }

  // Case 2: Same vote exists → remove vote (toggle off)
  else if (existingVote.voteType === voteType) {
    await Vote.deleteOne({ _id: existingVote._id });

    if (voteType === "upvote") comment.upvotes--;
    else comment.downvotes--;
  }

  // Case 3: Opposite vote exists → switch vote
  else {
    existingVote.voteType = voteType;
    await existingVote.save();

    if (voteType === "upvote") {
      comment.upvotes++;
      comment.downvotes--;
    } else {
      comment.downvotes++;
      comment.upvotes--;
    }
  }

  await comment.save();
  return comment;
};
  
