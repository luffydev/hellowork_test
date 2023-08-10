const sqlite3 = require('sqlite3').verbose();
const PoleEmplois = require('./Lib/PoleEmplois');
const logger = require('./Lib/logger');


const POLE_EMPLOIS_LOGIN_INFO = {
    CLIENT_ID: "PAR_testhellowork_92102702fd3099d9055cfe48c9fff7b3dee7276cd534d69b6095e63bd2461e6a",
    CLIENT_SECRET: "96b2be16e277096f2e1e78d1315b744afa1ed2cea3cea0db75f160858abfce53",
    CLIENT_SCOPE: "api_offresdemploiv2 o2dsoffre"
}

let authToken = "";

function poleEmploisLogin() {


    logger.info("Connecting to pole emplois's API...");

    PoleEmplois.auth(POLE_EMPLOIS_LOGIN_INFO.CLIENT_ID, POLE_EMPLOIS_LOGIN_INFO.CLIENT_SECRET, POLE_EMPLOIS_LOGIN_INFO.CLIENT_SCOPE).then((pResponse) => {
        logger.success("Connected to pole emplois's API");

        console.log(PoleEmplois.getAuthToken())

    }).catch((pError) => {
        logger.error("Unable to get auth token");
    });

}

poleEmploisLogin();