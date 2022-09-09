const db = require('../db/connection');

exports.selectRevById = (review_id) => {
  const queryString =
    'SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;';
  return db.query(queryString, [review_id]).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: 'That review id does not exist',
      });
    }
    return result.rows[0];
  });
};

exports.updateReviewVotes = (voteObj, review_id) => {
  if (
    Object.keys(voteObj).length === 0 ||
    voteObj.hasOwnProperty('inc_votes') === false
  ) {
    return Promise.reject({ status: 400, msg: 'Bad request, malformed body' });
  } else if (typeof voteObj.inc_votes !== 'number') {
    return Promise.reject({
      status: 400,
      msg: 'Bad request, incorrect value type',
    });
  } else {
    return db
      .query(
        'UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;',
        [voteObj.inc_votes, review_id]
      )
      .then((result) => {
        if (result.rowCount === 0) {
          return Promise.reject({
            status: 404,
            msg: 'That review id does not exist',
          });
        }
        return result.rows[0];
      });
  }
};

exports.selectReviews = () => {
  const queryString =
    'SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY created_at DESC';
  return db.query(queryString).then((result) => {
    return result.rows;
  });
};
