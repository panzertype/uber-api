const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 8080;

const app = express();

const authRouter = require('./routes/authRoutes');
const loadsRouter = require('./routes/loadsRoutes');
const trucksRouter = require('./routes/trucksRoutes');
const usersRouter = require('./routes/usersRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/auth', authRouter);
app.use('/api/loads', loadsRouter);
app.use('/api/trucks', trucksRouter);
app.use('/api/users/me', usersRouter);

app.listen(port);
