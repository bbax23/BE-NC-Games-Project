const db = require('../db/connection');

exports.selectRevById = (review_id) => {
  return db
    .query('SELECT * FROM reviews WHERE review_id = $1;', [review_id])
    .then((result) => {
      return result.rows[0];
    });
};
