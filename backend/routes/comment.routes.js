const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const voteController = require("../controllers/vote.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/seed", protect, commentController.seedComments);
// only for testing purposes, having get all comments and create comment without auth.
router.get("/", commentController.getAllComments);
router.post("/", commentController.createComment);
router.get("/top", commentController.getTopVotedComments); // bonus feature to get top voted comments without auth.
router.post("/:id/vote", protect, voteController.voteComment);

module.exports = router;
