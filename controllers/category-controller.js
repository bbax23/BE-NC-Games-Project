const { selectCategories } = require('../models/category-model');

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.send({ categories });
    })
    .catch(next);
};
