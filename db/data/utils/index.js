exports.formatArticlesData = articlesData => articlesData.map((article) => {
  const formattedArticleData = {
    ...article,
    username: article.created_by,
    created_at: new Date(article.created_at),
  };
  delete formattedArticleData.created_by;
  return formattedArticleData;
});

exports.formatCommentsData = (commentsData, articlesDocs) => {
  const formattedComments = commentsData.map((comment) => {
    const relevantArticle = articlesDocs.find(
      article => article.title === comment.belongs_to,
    );
    const formattedComment = {
      ...comment,
      username: comment.created_by,
      article_id: relevantArticle.article_id,
      created_at: new Date(comment.created_at),
    };

    delete formattedComment.belongs_to;
    delete formattedComment.created_by;
    return formattedComment;
  });
  return formattedComments;
};
