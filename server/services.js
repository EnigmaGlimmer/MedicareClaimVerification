const express = require('express');
const servicesRouter = express.Router();
const ClaimVerification = require("../client/src/contracts/Organizations.json");
const Web3 = require('web3');
var web3;
var networkId;
var accounts;
var contract;

init = async () => {
    try {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        web3.eth.net.getId().then(function (id) {
            networkId = id;
            web3.eth.getAccounts().then(function (acc) {
                accounts = acc;
                const deployedNetwork = ClaimVerification.networks[networkId];
                contract = new web3.eth.Contract(
                    ClaimVerification.abi,
                    deployedNetwork && deployedNetwork.address,
                );
                console.log("init", accounts)
                return [contract, accounts]
            });
        });
    } catch (err) {
        console.log(err)
    }
}

module.exports = function router() {
    servicesRouter.route('/provideService').post((req, res) => {
        init().then(function (arr) {
            arr[0].methods.provideService(req.body.serviceName,
                req.body.providerID, req.body.patientID).send({ from: arr[1][0] }).then(function (results) {
                    if (results) {
                        res.status(200).json({ message: 'OK', results: results })
                    } else {
                        res.status(200).json({ message: 'NOK', results: results })
                    }
                });
        });
    });

    servicesRouter.route('/fileClaim').post((req, res) => {
        init().then(function (arr) {
            arr[0].methods.fileClaim(req.body.serviceClaimID,
                req.body.amount).send({ from: arr[1][0] }).then(function (results) {
                    if (results) {
                        res.status(200).json({ message: 'OK', results: results })
                    } else {
                        res.status(200).json({ message: 'NOK', results: results })
                    }
                });
        });
    });

    servicesRouter.route('/preLoadInfo').get((req, res) => {
        init().then(function (arr) {
            console.log(arr[1])
            arr[0].methods.preLoadInfo().send({ from: arr[1][0] }).then(function (results) {
                if (results) {
                    res.status(200).json({ message: 'OK', results: results })
                } else {
                    res.status(200).json({ message: 'NOK', results: results })
                }
            });
        });
    });

    servicesRouter.route('/authenticate').post((req, res) => {
        init().then(function (arr) {
            arr[0].methods.getPatient(req.body.id).send({ from: arr[1][0] }).then(function (results) {
                if (results.events.PatientRetrieval.returnValues[0][0] === this.id) {
                    res.status(200).json({ message: 'OK', result: 'patient' })
                }
            });
            arr[0].methods.getProvider(req.body.id).send({ from: arr[1][0] }).then(function (results) {
                if (results.events.ProviderRetrieval.returnValues[0][0] === this.id) {
                    res.status(200).json({ message: 'OK', result: 'provider' })
                }
                else {
                    res.status(200).json({ message: 'NOK', result: '' })
                }
            });
        });
    });

    servicesRouter.route('/addPatient').post((req, res) => {
        init().then(function (arr) {
            arr[0].methods.addPatient(req.body.patientname, req.body.id).send({ from: arr[1][0] }).then(function (results) {
                if (results) {
                    res.status(200).json({ message: 'OK', results: results })
                }
                else {
                    res.status(200).json({ message: 'NOK', results: results })
                }
            })
        });
    });
    return servicesRouter;
};