const db = require('../db/connection');

exports.selectRevById = (review_id) => {
  return db
    .query('SELECT * FROM reviews WHERE review_id = $1;', [review_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: 'That review id does not exist',
        });
      }
      return result.rows[0];
    });
};
