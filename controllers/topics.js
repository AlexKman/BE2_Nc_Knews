const connection = require('../db/connection');

exports.getTopics = (req, res, next) => {
  connection
    .select('*')
    .from('topics')
    .then(topics => res.status(200).send({ topics }))
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  connection('topics')
    .insert(req.body)
    .returning('*')
    .then(([topic]) => res.status(201).send({ topic }))
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const {
    limit: maxResult = 10,
    orderBy: sort_by = 'created_at',
    sort_ascending,
    p = 1,
  } = req.query;

  const offsetValue = (+p - 1) * maxResult;

  connection
    .select(
      'articles.article_id',
      'articles.title',
      'articles.username AS author',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
    )

    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count({ comment_count: 'comments.article_id' })
    .groupBy('articles.article_id')
    .limit(maxResult)
    .orderBy(sort_by, sort_ascending === 'true' ? 'asc' : 'desc')
    .offset(offsetValue)
    .where('topic', req.params.topic)
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, message: 'Topic not found' });
      }
      return res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postArticleByTopic = (req, res, next) => {
  connection
    .select('*')
    .from('articles')
    .insert({ ...req.body, ...req.params })
    .returning('*')
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
