// Server Dependencies
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Models Imports
const Task = require('./api/models/todoListModel');
const User = require('./api/models/userModel');
const Sounds = require('./api/models/soundsModel');

// Init Express
const app = express();
require('dotenv').config();

// DB Connection
mongoose.Promise = global.Promise;
mongoose.connect(
  `mongodb://${process.env.DB_CONNECT}`,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  },
  e => {
    if (e) {
      const dbError = {
        error: e,
        msg: 'Error Connecting to Database. Please check MongoDB is running'
      };
      console.log(dbError);
    } else {
      console.log('Connected to Database');
    }
  }
);

// Server Config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cors Controls
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS'
  );
  next();
});
app.use(cors());

// Routes Definitions
const userRoutes = require('./api/routes/userRoutes');
const authRoutes = require('./api/routes/authRoutes');
const todoRoutes = require('./api/routes/todoListRoutes');
const soundsRoutes = require('./api/routes/soundsRoutes');
userRoutes(app);
authRoutes(app);
todoRoutes(app);
soundsRoutes(app);

// 404 Handling
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});

// Server Port Controls
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
