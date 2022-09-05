const db = require('../db');

exports.selectCategories = () => {
  return db.query('SELECT * FROM categories').then((result) => {
    return result.rows;
  });
};
