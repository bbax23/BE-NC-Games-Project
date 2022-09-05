const { selectCategories } = require('../models/category-model');

exports.getCategories = (req, res) => {
  selectCategories().then((categories) => {
    res.send({ categories });
  });
};
