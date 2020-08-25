const express = require('express');
const debug = require('debug')('app:userAccountsRoutes');
const passport = require('passport');
const db = require('./db');

const userAccountRouter = express.Router();

module.exports = function router() {
    userAccountRouter.route('/register')
      .post((req, res, next) => {
        const { username, role, email } = req.body;
        console.log('at register, ', req.body)
        db.query('select * from user where email=?', [email], (err, results) => {
          if(results.length === 0){
            db.query('insert into user (id, name, email, role, address) values (?, ?, ?, ?, ?)', [username, username, email, role, null], (err, results) => {
              if(err){
                debug(err);
                res.status(500).json({ message: 'Server error' });
              }
              res.status(200).json({ message: 'User created'})
            })
          } else {
            console.log('User already exists')
            res.status(401).json({ message: 'User already exists' });
          }
        })
      })

    userAccountRouter.route('/getAddr')
      .get((req, res, next) => {
        const { id } = req.body
        db.query('select address from user where id=?', [id], (err, results) => {
          if(results.length !== 0){
            const userJSON = JSON.parse(JSON.stringify(results[0]));
            const { address } = userJSON;
            console.log('getAddr 200')
            res.status(200).json({ message: 'Address found', address: address })
          }
        })
      })

    userAccountRouter.route('/loginIDOnly')
      .post((req, res, next) => {
        const { email } = req.body
        console.log(email)
        db.query('select * from user where email=?', [email], (err, results) => {
          debug(results)
          if(results.length !== 0){
            const userJSON = JSON.parse(JSON.stringify(results[0]));
            const { name, role } = userJSON;
                const user = {
                  name: name,
                  role: role
                };
            console.log('loginIDOnly 200')
            res.status(200).json({ message: 'User found', user: user })
          } else {
            console.log('loginIDOnly 401')
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