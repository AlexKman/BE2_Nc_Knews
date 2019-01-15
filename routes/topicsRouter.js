const topicsRouter = require('express').Router();
const {
  getTopics,
  postTopic,
  getArticlesByTopic,
  postArticleByTopic,
} = require('../controllers/topics');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(postTopic);

topicsRouter
  .route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(postArticleByTopic);

module.exports = topicsRouter;
