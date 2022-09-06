const db = require('../db/connection');

exports.selectRevById = (review_id) => {
  return db
    .query('SELECT * FROM reviews WHERE review_id = $1;', [review_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 400,
          msg: 'Bad request, that review id does not exist',
        });
      } else {
        return result.rows[0];
      }
    });
};
