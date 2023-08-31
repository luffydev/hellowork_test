const PoleEmplois = require('./Lib/PoleEmplois');
const logger = require('./Lib/logger');
const config = require('./config');

function poleEmploisLogin() {

    logger.info("Connecting to pole emplois's API...");

    PoleEmplois.auth(config.POLE_EMPLOIS_LOGIN_INFO.CLIENT_ID, config.POLE_EMPLOIS_LOGIN_INFO.CLIENT_SECRET, config.POLE_EMPLOIS_LOGIN_INFO.CLIENT_SCOPE).then(() => {

        logger.success("Connected to pole emplois's API with token : " + PoleEmplois.getAuthToken());

        Object.entries(config.ZONES).map(([city, zoneID] = entries) => {
            logger.info("Getting jobs for " + city + " with zoneID : " + zoneID);

            PoleEmplois.syncJobOffers(zoneID).then((linesAdded) => {
                logger.success("Finished getting jobs for " + city + " ( " + linesAdded + " new lines added ) ");
                logger.info("Generating stats for " + city);

                PoleEmplois.generateStats(zoneID).then(() => {
                    logger.success("Finished stats for " + city);
                });

            }).catch((error) => {
                logger.error(error);
            });
        })



    }).catch((pError) => {
        logger.error("Unable to get auth token", pError);
    });

}

poleEmploisLogin();