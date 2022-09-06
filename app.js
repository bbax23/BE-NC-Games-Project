const express = require('express');
const { getCategories } = require('./controllers/category-controller');

const app = express();

app.get('/api/categories', getCategories);

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Invalid path.' });
});

module.exports = app;
