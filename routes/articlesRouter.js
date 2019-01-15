const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchArticleVotes
} = require("../controllers/articles");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);
module.exports = articlesRouter;
