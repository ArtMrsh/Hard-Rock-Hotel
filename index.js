const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

mongoose.connect('mongodb://root:artemko_2013@ds247007.mlab.com:47007/rooms');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(cors());

app.get('/', (req, res) => {
  res.send('works!');
});

require('./routes/room.routes.js')(app);

const PORT = 3030;

app.listen(PORT);
