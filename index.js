const PoleEmplois = require('./Lib/PoleEmplois');
const logger = require('./Lib/logger');
const config = require('./config');

function poleEmploisLogin() {

    logger.info("Connecting to pole emplois's API...");

    // We auth to Pole Emplois services and get access token
    PoleEmplois.auth(config.POLE_EMPLOIS_LOGIN_INFO.CLIENT_ID, config.POLE_EMPLOIS_LOGIN_INFO.CLIENT_SECRET, config.POLE_EMPLOIS_LOGIN_INFO.CLIENT_SCOPE).then(() => {

        logger.success("Connected to pole emplois's API with token : " + PoleEmplois.getAuthToken());

        for (let cityName in config.ZONES) {

            let zoneID = config.ZONES[cityName];

            logger.info("Getting jobs for " + cityName + " with zoneID : " + zoneID);

            PoleEmplois.syncJobOffers(zoneID).then((linesAdded) => {
                logger.success("Finished getting jobs for " + cityName + " ( " + linesAdded + " new lines added ) ");
                logger.info("Generating stats for " + cityName);

                PoleEmplois.generateStats(zoneID).then(() => {
                    logger.success("Finished stats for " + cityName);
                });

            }).catch((error) => {
                logger.error(error);
            });
        }

    }).catch((pError) => {
        logger.error("Unable to get auth token", pError);
    });

}

poleEmploisLogin();