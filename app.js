const express = require('express');
const { getCategories } = require('./controllers/category-controller');

const app = express();

app.get('/api/categories', getCategories);

app.use((err, req, res, next) => {});

module.exports = app;
