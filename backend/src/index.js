const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const { getCookie, notFound } = require('./middleware/errorHandler');

const app = require("./app");

const port = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
// Basic middleware
app.use(express.json());
app.use(morgan('dev'));

// Not Found
app.use('*', notFound);

getCookie();

app.listen(port, () => console.log('Backend running on http://localhost:' + port));