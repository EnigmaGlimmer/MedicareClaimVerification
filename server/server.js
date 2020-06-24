require('dotenv').config()
const nodemailer = require('nodemailer');
const express = require('express')
const app = express()
const port = 4000
const bodyParser = require("body-parser");

const idMapping = {
  'UCSD Medical': {id: '0xb12d1ac9dbfc9766d319f7dddcced62a4a5b042bbcfd3c15eda087af861488f4', role: 'Provider'},
  'Ken': {id: '0x208432b29a1d0dc0bafe10c0bf4ae03bdc4f3ca37894c85e7c3cadbf65719b39', role: 'Patient'},
  'Danny': {id: '0x22299a2d4f3047b228c319c2a0569bcf4e9a117d8488cb391600a84c19145290', role: 'Patient'},
  'Antonio': {id: '0x55f5cf1d81bd8db77408ca0c82606729cc9cd581b02513f6281ddca07e686418', role: 'Patient'},
  'CMS': {id: "0xd6fac875a4e1507f805c73b36425605dbc5f0a8f2cc2bcf50b469c8085341b56", role: 'Insurer'}
}

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.E_USER,
    pass: process.env.E_PASS
  }
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/patientCellCreated', function (req, res) {
    let patientname = req.body.patientname;
    var mailOptions = {
        from: process.env.E_USER,
        to: process.env.E_RCVR,
        subject: 'Notification of New Patient Cell',
        text: `Patient Cell for ${patientname} has been created!!!`
      };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(200).json({ message: 'NOK' })
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).json({ message: 'OK' })
        }
      });
});

app.use('/claimAdded', function (req, res) {
    let patientname = req.body.patientname;
    let serviceID = req.body.serviceID;
    let servicename = req.body.service;
    let amount = req.body.amount;
    var mailOptions = {
        from: process.env.E_USER,
        to: process.env.E_RCVR,
        subject: 'Notification of claim added',
        text: `Claim of amount ${amount} for ${patientname} has been added into the service ${servicename}!!! Service Claim ID: ${serviceID}`
      };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(200).json({ message: 'NOK' })
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).json({ message: 'OK' })
        }
      });
});

app.use('/serviceClaimCreated', function (req, res) {
  let patientname = req.body.patientname;
  let serviceID = req.body.serviceID;
  let servicename = req.body.service;
  var mailOptions = {
      from: process.env.E_USER,
      to: process.env.E_RCVR,
      subject: 'Notification of service claim created',
      text: `New Service Claim ${servicename} created for ${patientname}!!! Service Claim ID: ${serviceID}`
    };
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.status(200).json({ message: 'NOK' })
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'OK' })
      }
    });
});

app.use('/login', function(req, res){
  var username = req.body.username;
  if(!idMapping[username]){
    res.status(200).json({ message: 'NOK' })
  }
  else {
    res.status(200).json({ message: 'OK', result: idMapping[username] })
  }
})

const userRouter = require('.routes/userAccountRoutes.js')();

app.use('/profile, userAccountRouter');

app.get('/', (req, res) => {
  res.send('Test');
})

app.listen(port, () => console.log(`App listening on port ${port}!`))