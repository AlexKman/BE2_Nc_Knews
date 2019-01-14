const topicsData = require("../development-data/topics");
const usersData = require("../development-data/users");
const articlesData = require("../development-data/articles");
const commentsData = require("../development-data/comments");
const { formatArticlesData, formatCommentsData } = require("../utils");

exports.seed = function(knex, Promise) {
  return knex("topics")
    .del()
    .then(() =>
      knex("topics")
        .insert(topicsData)
        .returning("*")
    )
    .then(() => knex("users").del())
    .then(() =>
      knex("users")
        .insert(usersData)
        .returning("*")
    )
    .then(userRows => Promise.all([userRows, knex("articles").del()]))
    .then(([userRows]) =>
      Promise.all([
        knex("articles")
          .insert(formatArticlesData(articlesData))
          .returning("*"),
        userRows
      ])
    )
    .then(([articlesDocs, userDocs]) =>
      knex("comments")
        .insert(formatCommentsData(commentsData, articlesDocs, userDocs))
        .returning("*")
    );
};
