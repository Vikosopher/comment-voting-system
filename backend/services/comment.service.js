const Comment = require("../models/comment.model");

const sampleContents = [
  "Great point!",
  "I disagree.",
  "Can you explain more?",
  "Love this feature!",
  "Not sure this works well.",
  "This saved me time!",
  "Needs more clarity.",
  "Interesting perspective.",
  "Totally agree.",
  "This is confusing...",
  "More examples, please.",
  "Thanks for sharing!",
  "Where is the source?",
  "I would do it differently.",
  "What is the use case?",
  "Try refactoring.",
  "Super helpful.",
  "This is outdated.",
  "Add tests!",
  "Clear explanation!",
];

exports.seedMockComments = async () => {
  await Comment.deleteMany({}); // Optional: clear previous mock comments

  const commentDocs = sampleContents.map((content) => ({ content }));

  return await Comment.insertMany(commentDocs);
};

exports.getTopVotedComments = async () => {
  return await Comment.find().sort({
    upvotes: -1, // Sort by highest upvotes first
    downvotes: 1, // If there's a tie, sort by lowest downvotes
    createdAt: -1, // If there's still a tie, show newest comments first
  }).limit(10); // Limit to top 10 comments
};

exports.getAllComments = async () => {
  const comments = await Comment.find().sort({ createdAt: -1 });
  return comments;
};


exports.createComment = async (content) => {
  const newComment = new Comment({ content });
  await newComment.save();
  return newComment;
};


