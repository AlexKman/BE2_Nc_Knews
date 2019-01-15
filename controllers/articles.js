const connection = require("../db/connection");

exports.getArticles = (req, res, next) => {
  const {
    limit: maxResult = 10,
    orderBy: sort_by = "created_at",
    sort_ascending,
    p = 0
  } = req.query;
  connection
    .select(
      "articles.article_id",
      "articles.title",
      "articles.username AS author",
      "articles.votes",
      "articles.created_at",
      "articles.topic",
      "articles.body"
    )
    .from("articles")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .count("comments.article_id")
    .groupBy("articles.article_id")
    .limit(maxResult)
    .orderBy(sort_by, sort_ascending === "true" ? "asc" : "desc")
    .offset(p)
    .then(articles => res.status(200).send({ articles }))
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  connection
    .select(
      "articles.article_id",
      "articles.title",
      "articles.username AS author",
      "articles.votes",
      "articles.created_at",
      "articles.topic",
      "articles.body"
    )
    .from("articles")
    .where("articles.article_id", req.params.article_id)
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .count("comments.article_id")
    .groupBy("articles.article_id")
    .then(article => {
      if (article.length === 0)
        return Promise.reject({ status: 404, message: "Article not found" });
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { inc_votes: newVotes = 0 } = req.body;
  connection
    .select("*")
    .where({ article_id: req.params.article_id })
    .increment("votes", newVotes)
    .from("articles")
    .returning("*")
    .then(([article]) => {
      if (!article)
        return Promise.reject({ status: 404, message: "Article not found" });
      res.status(200).send({ article });
    })
    .catch(next);
};
