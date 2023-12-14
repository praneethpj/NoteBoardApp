const express = require('express');
const cors = require('cors');
const http = require('http');
const { db, TypedContent } = require('./db');
const createSocket = require('./middleware');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = createSocket(server, TypedContent);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
