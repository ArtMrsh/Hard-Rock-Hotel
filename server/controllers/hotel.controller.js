const Room = require('../models/hotel.js');

exports.create = (req, res) => {
  const { name, price, quantity, square, beds, description, image, type, booked } = req.body;

  const room = new Room({
    name,
    price,
    quantity,
    square,
    beds,
    description,
    image,
    type,
    booked
  });

  room.save((err, data) => {
    if (err) {
      res.status(500).send({ message: 'Error occured' });
    } else {
      res.send(data);
    }
  });
};

exports.findAll = (req, res) => {
  Room.find((err, rooms) => {
    if (err) {
      res.status(500).send({ message: 'Error occured' });
    } else {
      res.send(rooms);
    }
  });
};
