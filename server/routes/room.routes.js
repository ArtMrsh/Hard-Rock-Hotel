module.exports = app => {
  const rooms = require('../controllers/hotel.controller.js');

  app.get('/api/hotels', rooms.findAll);

  app.post('/api/hotel', rooms.create);
};
