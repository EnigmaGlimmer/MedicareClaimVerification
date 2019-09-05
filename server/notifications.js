const express = require('express');
const notificationsRouter = express.Router();
require('dotenv').config()
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.E_USER,
        pass: process.env.E_PASS
    }
});

module.export = function router() {
    notificationsRouter.route('/patientCellCreated').post((req, res) => {
        let patientname = req.body.patientname;
        var mailOptions = {
            from: process.env.E_USER,
            to: process.env.E_RCVR,
            subject: 'Notification of New Patient Cell',
            text: `Patient Cell for ${patientname} has been created!!!`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(200).json({ message: 'NOK' })
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'OK' })
            }
        });
    });

    notificationsRouter.route('/claimAdded').post((req, res) => {
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
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(200).json({ message: 'NOK' })
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'OK' })
            }
        });
    });

    notificationsRouter.route('/serviceClaimCreated').post((req, res) => {
        let patientname = req.body.patientname;
        let serviceID = req.body.serviceID;
        let servicename = req.body.service;
        var mailOptions = {
            from: process.env.E_USER,
            to: process.env.E_RCVR,
            subject: 'Notification of service claim created',
            text: `New Service Claim ${servicename} created for ${patientname}!!! Service Claim ID: ${serviceID}`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(200).json({ message: 'NOK' })
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'OK' })
            }
        });
    });

    return notificationsRouter;
};