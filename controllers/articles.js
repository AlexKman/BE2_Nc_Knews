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
    .count({ comment_count: "comments.article_id" })
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
    .count({ comment_count: "comments.article_id" })
    .groupBy("articles.article_id")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Article not found"
        });
      }
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

exports.deleteArticle = (req, res, next) => {
  connection
    .select("*")
    .where({ article_id: req.params.article_id })
    .from("articles")
    .del()
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const {
    limit: maxResult = 10,
    orderBy: sort_by = "created_at",
    sort_ascending,
    p = 0
  } = req.query;
  connection
    .select(
      "comments.comment_id",
      "comments.username AS author",
      "comments.votes",
      "comments.created_at AS date",
      "comments.body",
      "comments.article_id"
    )
    .where({ article_id: req.params.article_id })
    .from("comments")
    .limit(maxResult)
    .orderBy(sort_by, sort_ascending === "true" ? "asc" : "desc")
    .offset(p)
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          message: "No comments found/ no article found"
        });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  connection("comments")
    .insert({ ...req.body, ...req.params })
    .returning("*")
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchACommentByArticleId = (req, res, next) => {
  const { inc_votes: newVotes = 0 } = req.body;
  connection
    .select("*")
    .where({ article_id: req.params.article_id })
    .where({ comment_id: req.params.comment_id })
    .increment("votes", newVotes)
    .from("comments")
    .returning("*")
    .then(([comment]) => {
      if (!comment)
        return Promise.reject({ status: 404, message: "Comment not found" });
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentByArticleId = (req, res, next) => {
  connection
    .select("*")
    .where({ article_id: req.params.article_id })
    .where({ comment_id: req.params.comment_id })
    .from("comments")
    .del()
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
