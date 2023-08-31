const axios = require('axios');
const config = require('../config');
const database = require('./JobDatabase');
const logger = require('./logger');

class PoleEmplois {

    authToken = null;

    ////////////////////////////////////////////
    //             Auth to API
    ////////////////////////////////////////////

    constructor() {
        database.openDatabase();
    }

    auth(clientID, clientSecret, clientScope) {

        let promise = new Promise((resolve, reject) => {
            axios.post(config.POLE_EMPLOIS_API_URL.LOGIN_URL, {
                'grant_type': 'client_credentials',
                'client_id': clientID,
                'client_secret': clientSecret,
                'scope': clientScope
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }

            }).then((response) => {

                if ("data" in response && "access_token" in response.data) {

                    this.authToken = response.data.access_token;
                    resolve();

                    return;

                }

                reject();

            }).catch(() => {
                reject();
            });
        })

        return promise;
    }

    ////////////////////////////////////////////
    //            Sync jobs offers
    ////////////////////////////////////////////

    syncJobOffers(zone) {

        let promise = new Promise((resolve, reject) => {

            if (!this.getAuthToken()) {
                reject("Invalid pole emplois token, are you authenticated ?");
                return;
            }

            let parameters = "commune";

            if (zone.toString().length == 2)
                parameters = "departement";

            axios.get(config.POLE_EMPLOIS_API_URL.OFFER_URL + '?' + parameters + '=' + zone + '&distance=0',
                { headers: { 'Authorization': 'Bearer ' + this.getAuthToken() } }).then((response) => {

                    database.getJobIDForZone(zone).then((listID) => {

                        let linesAdded = 0;

                        response.data.resultats.forEach(currentOffer => {
                            let offerID = currentOffer.id;

                            if (!listID.includes(offerID)) {
                                database.addJob(zone, currentOffer);
                                linesAdded++;
                            }
                        })

                        resolve(linesAdded);

                    }).catch((error) => {
                        reject(error);
                    });



                }).catch(() => {
                    reject(config.POLE_EMPLOIS_API_URL.OFFER_URL + " return error, service unavailable ?");
                })
        });

        return promise;
    }

    generateStats(zoneID) {
        return database.generateReport(zoneID);
    }

    ////////////////////////////////////////////
    //         Get current auth token
    ////////////////////////////////////////////

    getAuthToken() {
        return this.authToken;
    }

}

module.exports = new PoleEmplois;