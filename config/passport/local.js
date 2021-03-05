/**
 * Module dependencies.
 */
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../app/models/UserSchema');

/**
 * Expose
 */

module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    const options = {
      criteria: { email: email }
    };
    User.load(options, function(err, user) {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' });
      }
      return done(null, user);
    });
  }
);
