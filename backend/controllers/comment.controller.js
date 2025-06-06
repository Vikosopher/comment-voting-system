const commentService = require("../services/comment.service");

exports.seedComments = async (req, res) => {
  try {
    const comments = await commentService.seedMockComments();
    res.status(201).json({
      message: "Mock comments seeded successfully",
      total: comments.length,
      comments,
    });
  } catch (err) {
    console.error("Seed Comments Error:", err.message);
    res.status(500).json({ message: "Failed to seed comments" });
  }
};

exports.getTopVotedComments = async (req, res) => {
  try {
    const comments = await commentService.getTopVotedComments();
    res.status(200).json({ comments });
  } catch (err) {
    console.error("Top Voted Fetch Error:", err.message);
    res.status(500).json({ message: "Failed to fetch top voted comments" });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await commentService.getAllComments();
    res.status(200).json({ comments });
  } catch (err) {
    console.error("Fetch All Comments Error:", err.message);
    res.status(500).json({ message: "Failed to fetch all comments" });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    const comment = await commentService.createComment(content.trim());
    res.status(201).json(comment);
  } catch (error) {
    console.error("Create Comment Error:", error);
    res.status(500).json({ message: "Failed to create comment" });
  }
};
