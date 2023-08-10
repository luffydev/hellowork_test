const axios = require('axios');
const logger = require('./logger')

const POLE_EMPLOIS_API_URL = {
    LOGIN_URL: "https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=%2Fpartenaire",
    OFFER_URL: "https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search,"
}

class PoleEmplois {

    authToken = null;

    ////////////////////////////////////////////
    //             Auth to API
    ////////////////////////////////////////////

    auth(clientID, clientSecret, clientScope) {

        let promise = new Promise((resolve, reject) => {
            axios.post(POLE_EMPLOIS_API_URL.LOGIN_URL, {
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
                    resolve(response.data);

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
    //            Get jobs offers
    ////////////////////////////////////////////

    getJobOffers() {

    }

    ////////////////////////////////////////////
    //         Get current auth token
    ////////////////////////////////////////////

    getAuthToken() {
        return this.authToken;
    }

}

module.exports = new PoleEmplois;