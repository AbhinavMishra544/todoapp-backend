const jwt = require('jsonwebtoken');

module.exports = {
  isValidUser: async (req, res, next) => {
    var token = req.headers['authorization'];
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: 'No token provided.' });
    }
    token = token.split('Bearer ')[1];
    jwt.verify(token, 'secret', function(err) {
      if (err)
        return res
          .status(500)
          .send({ auth: false, message: 'Failed to authenticate token.' });

      next();
    });
  }
};
