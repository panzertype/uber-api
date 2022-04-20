const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./config/db');
const port = process.env.PORT || 8080;

connectDB();

const app = express();

const authRouter = require('./routes/authRoutes');
const loadsRouter = require('./routes/loadsRoutes');
const trucksRouter = require('./routes/trucksRoutes');
const usersRouter = require('./routes/usersRoutes');

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api/auth', authRouter);
app.use('/api/loads', loadsRouter);
app.use('/api/trucks', trucksRouter);
app.use('/api/users/me', usersRouter);

app.listen(port);
