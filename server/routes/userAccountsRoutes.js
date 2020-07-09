const express = require('express');
const debug = require('debug')('app:userAccountsRoutes');
const passport = require('passport');
const db = require('./db');

const userAccountRouter = express.Router();

module.exports = function router() {
    // userAccountRouter.route('/')
    //   .get((req, res) => {
    //     res.send('Accounts');
    //     db.query('SELECT * FROM user_table where ut_user_id = "Test2" ', (err, results) => {
    //       if (err) res.send(err);
    //       debug(results.length);
    //     });
    //   });
  
    // userAccountRouter.route('/register')
    //   .post((req, res) => {
    //     const {
    //       username, firstName, lastName, emailID, password, confirmPassword,
    //     } = req.body;
    //     if (password === '') {
    //       res.status(401).json({ message: 'No password entered' });
    //     } else if (password !== confirmPassword) {
    //       res.status(401).json({ message: 'Passwords do not match' });
    //     } else if (!validateEmail(emailID)) {
    //       res.status(401).json({ message: 'Invalid email' });
    //     } else {
    //       db.query('SELECT ut_user_id FROM user_table WHERE ut_email=? OR ut_user_id=?', [emailID, username], (err, results) => {
    //         if (err) {
    //           debug(err);
    //           res.status(500).json({ message: 'Server error' });
    //         }
    //         if (results.length === 0) {
    //           db.query('INSERT INTO user_table (ut_user_id, ut_password, ut_first_name, ut_last_name, ut_email) VALUES (?, ?, ?, ?, ?)',
    //             [username, MD5(username + password), firstName, lastName, emailID],
    //             (err3) => {
    //               if (err3) {
    //                 debug(err3);
    //                 res.status(500).json({ message: 'Server error' });
    //               }
    //               res.status(201).send({ userID: username });
    //             });
    //         } else {
    //           res.status(401).json({ message: 'Email or username already exists' });
    //         }
    //       });
    //     }
    //   });
  
    // userAccountRouter.route('/login')
    //   .post((req, res, next) => {
    //     console.log(req.body)
    //     if (req.user) res.status(200).json({ message: 'User already logged in' });
    //     else {
    //       passport.authenticate('local', (err, user) => {
    //         if (err) return res.status(500).json({ message: 'Server error', err });
    //         if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    //         req.login(user, (err2) => {
    //           if (err2) return res.status(500).json({ message: 'Server error', err });
    //           return res.status(200).json({ message: 'user authenticated', user: user });
    //         });
    //       })(req, res, next);
    //     }
    //   });

    userAccountRouter.route('/loginIDOnly')
      .post((req, res, next) => {
        console.log(req.body)
        const { id } = req.body
        db.query('select * from user where id=?', [id], (err, results) => {
          debug(results)
          if(results.length !== 0){
            const userJSON = JSON.parse(JSON.stringify(results[0]));
            const { name, role } = userJSON;
                const user = {
                  name: name,
                  role: role
                };
            res.status(200).json({ message: 'User found', user: user })
          } else {
            res.status(401).json({ message: 'User not found' });
          }
        })
      });
  
    userAccountRouter.route('/logout')
      .get((req, res) => {
        if (req.user) {
          req.logout();
          res.status(200).json({ message: 'User succesfully logged out' });
        } else {
          res.status(401).json({ message: 'User not logged in' });
        }
      });
  
    // userAccountRouter.route('/change_password')
    //   .post((req, res, next) => {
    //     passport.authenticate('local', (err, user) => {
    //       if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    //       const { utEmail, newPassword, confirmPassword } = req.body;
    //       if (confirmPassword === newPassword) {
    //         db.query('UPDATE user_table SET ut_password = ? WHERE ut_email = ? AND ut_user_id = ?', [
    //           MD5(user.utUserId + user.newPassword), utEmail, user.utUserId], (results) => {
    //           debug(results);
    //         });
    //       } else {
    //         res.status(401).json({ message: 'Please ensure that your confirming password matches your new password.' });
    //       }
    //     })(req, res, next);
    //   });
  
    userAccountRouter.route('/loggedin').get((req, res) => {
      if (req.user) {
        res.status(200).json({ message: 'OK' });
      } else {
        res.status(200).json({ message: 'NOK' });
      }
    });
    return userAccountRouter;
  };