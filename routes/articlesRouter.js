const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleVotes,
  deleteArticle,
  getCommentsByArticleId
} = require("../controllers/articles");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes)
  .delete(deleteArticle);

articlesRouter.route("/:article_id/comments").get(getCommentsByArticleId);
module.exports = articlesRouter;
