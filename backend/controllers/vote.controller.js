const voteService = require("../services/vote.service");

exports.voteComment = async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const { voteType } = req.body;
    const userId = req.user.id;

    const updatedComment = await voteService.voteOnComment(
      userId,
      commentId,
      voteType
    );

    res.status(200).json({
      message: `Successfully ${
        voteType === "upvote" ? "upvoted" : "downvoted"
      }`,
      comment: updatedComment,
    });
  } catch (err) {
    console.error("Vote Error:", err.message);
    res
      .status(400)
      .json({ message: err.message || "Failed to vote on comment" });
  }
};
  