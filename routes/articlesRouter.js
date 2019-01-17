const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleVotes,
  deleteArticle,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchACommentByArticleId,
  deleteCommentByArticleId
} = require("../controllers/articles");

const { handle405 } = require("../errors");

articlesRouter
  .route("/")
  .get(getArticles)
  .all(handle405);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes)
  .delete(deleteArticle)
  .all(handle405);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(handle405);

articlesRouter
  .route("/:article_id/comments/:comment_id")
  .patch(patchACommentByArticleId)
  .delete(deleteCommentByArticleId)
  .all(handle405);

module.exports = articlesRouter;
