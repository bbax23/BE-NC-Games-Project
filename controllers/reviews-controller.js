const {
  selectRevById,
  updateReviewVotes,
  selectReviews,
} = require('../models/reviews-model.js');

exports.getRevById = (req, res, next) => {
  const { review_id } = req.params;
  selectRevById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewVotes = (req, res, next) => {
  const voteObj = req.body;
  const { review_id } = req.params;
  updateReviewVotes(voteObj, review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getReviews = (req, res) => {
  const { category } = req.query;
  selectReviews(category).then((reviews) => {
    res.status(200).send({ reviews });
  });
};
