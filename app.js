const express = require('express');
const { getCategories } = require('./controllers/category-controller');
const { getRevById } = require('./controllers/reviews-controller');

const app = express();

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getRevById);

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Invalid path.' });
});

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request, that review id does not exist' });
  } else {
    res.status(500).send({ msg: 'Internal server error' });
  }
});
module.exports = app;
