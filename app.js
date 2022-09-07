const express = require('express');
const { getCategories } = require('./controllers/category-controller');
const {
  getRevById,
  patchReviewVotes,
} = require('./controllers/reviews-controller');
const { getUsers } = require('./controllers/users-controller');

const app = express();
app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getRevById);
app.get('/api/users', getUsers);

app.patch('/api/reviews/:review_id', patchReviewVotes);

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Invalid path.' });
});

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request, not a review id' });
  } else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: 'Internal server error' });
  }
});
module.exports = app;
