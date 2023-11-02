const dotenv = require('dotenv');

dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { requestLogger } = require('./middlewares/logger');
const routes = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

app.use(requestLogger);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ['https://kinosite.nomoredomainsicu.ru', 'http://localhost:3000' 'https://api.nomoreparties.co'],
    credentials: true,
  }),
);

mongoose.connect('mongodb://127.0.0.1:27017/moviesdb');

app.use(routes);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(PORT));
