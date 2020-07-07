const { Strategy } = require('passport-local');
const debug = require('debug')('app:local.strategy');
const db = require('../routes/db');

module.exports = function localStrategy(passport) {
  passport.use('local', new Strategy(
    {
      usernameField: 'id',
      passwordField: 'password',
    }, (id, password, done) => {
      db.query('SELECT * FROM user where id=? and password=?', [id, password],
        (err, results, fields) => {
          if (err) debug(err);
          if (results.length !== 0) {
            const userJSON = JSON.parse(JSON.stringify(results[0]));
            const { name, role } = userJSON;
                const user = {
                  name: name,
                  role: role
                };
                done(err, user);
              } else {
                done(err, false);
              }
            });
    },
  ));
};