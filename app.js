const express = require('express');

const app = express();

app.get('/api/categories');

app.use((err, req, res, next) => {});

module.exports = app;
