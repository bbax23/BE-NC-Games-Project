const {
  selectRevById,
  updateReviewVotes,
  selectReviews,
  selectReviewComments,
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

exports.getReviews = (req, res, next) => {
  const { category } = req.query;
  selectReviews(category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewComments = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
