const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const commentsRouter = require('./commentsRouter');
const articlesRouter = require('./articlesRouter');
const usersRouter = require('./usersRouter');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
module.exports = apiRouter;
