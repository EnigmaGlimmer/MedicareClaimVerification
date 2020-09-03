const express = require('express');
const debug = require('debug')('app:userAccountsRoutes');
const passport = require('passport');
const db = require('./db');

const modifyUserRouter = express.Router();

module.exports = function router() {
  modifyUserRouter.route('/testOnly-updateUserContractAddressAfterRedeployment')
    .post((req, res) => {
      const {
        id, addr
      } = req.body;
      console.log('req.body contents', id, addr)
      db.query('update user set address=? where id=?', [addr, id], (err, results) => {
        if (err) {
          debug(err);
          res.status(500).json({ message: 'Server error' });
        }
      })
      db.query('select id from user where address=?', [addr], (err, results) => {
        console.log('results query', results.length)
        if (results.length === 1) {
          res.status(201).json({ message: 'Change successful', id: id, addr: addr });
        }
        else{
          res.status(401).json({ message: 'Id not found' });
        }
      })
    });

  modifyUserRouter.route('/createPatient')
    .post((req, res) => {
      const { id, addr } = req.body;
      db.query('select id from user where id=? and address=?', [id, addr], (err, results) => {
        if (err) {
          debug(err);
          res.status(500).json({ message: 'Server error' });
        }
        if (results.length === 0) {
          db.query('insert into user (id, name, email, role, address) values (?, ?, ?, ?, ?)', [id, id, null, 'Patient', addr], (err, results) => {
            if (results.length === 1) {
              res.status(201).json({ message: 'Change successful', id: id, addr: addr });
            }
            res.status(401).json({ message: 'Creation unsuccessful' });
          })
        }
      })
    });

  // modifyUserRouter.route('/addPatientToProvider')
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

  return modifyUserRouter;
};