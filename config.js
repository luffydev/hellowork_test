const DatabaseConfig = {
    name: './database.db',
    sql: `CREATE TABLE IF NOT EXISTS job_offers (
        id           INTEGER   PRIMARY KEY AUTOINCREMENT,
        jobID        TEXT (10),
        zoneID       INTEGER   NOT NULL,
        title        TEXT      NOT NULL,
        description  TEXT      NOT NULL,
        dateCreation TEXT      NOT NULL,
        dateUpdate   TEXT      NOT NULL,
        contractType TEXT      NOT NULL,
        companyName  TEXT,
        applyURL     TEXT      NOT NULL
    );`
}

const POLE_EMPLOIS_API_URL = {
    LOGIN_URL: "https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=%2Fpartenaire",
    OFFER_URL: "https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search"
}


const POLE_EMPLOIS_LOGIN_INFO = {
    CLIENT_ID: "PAR_testhellowork_92102702fd3099d9055cfe48c9fff7b3dee7276cd534d69b6095e63bd2461e6a",
    CLIENT_SECRET: "96b2be16e277096f2e1e78d1315b744afa1ed2cea3cea0db75f160858abfce53",
    CLIENT_SCOPE: "api_offresdemploiv2 o2dsoffre"
}


const ZONES = {
    PARIS: 75,
    RENNES: 35238,
    BORDEAUX: 33063,
}

function getNameForZoneID(pZoneID) {

    let city = "";

    for (let property in ZONES) {

        if (ZONES[property] == pZoneID)
            city = property;
    }

    return city;
}

module.exports = { DatabaseConfig, POLE_EMPLOIS_API_URL, POLE_EMPLOIS_LOGIN_INFO, ZONES, getNameForZoneID }