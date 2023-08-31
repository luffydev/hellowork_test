
const sqlite3 = require('sqlite3');
const config = require('../config')
const logger = require('./logger');
const fs = require('fs');
const { AsciiTable3, AlignmentEnum } = require('ascii-table3');

class JobDatabase {

    databasePTR = null;
    jobIDList = [];
    preparedStatement = null;

    openDatabase() {
        this.databasePTR = new sqlite3.Database(config.DatabaseConfig.name);
        this.databasePTR.run(config.DatabaseConfig.sql, () => {
            this.preparedStatement = this.databasePTR.prepare(`INSERT INTO job_offers(jobID, zoneID, title, description, dateCreation, dateUpdate, contractType, companyName, applyURL) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        });
    }

    ////////////////////////////////////////////
    //            Add Job to DB
    ////////////////////////////////////////////

    addJob(zoneID, jobItems) {
        this.preparedStatement.run([jobItems.id, zoneID, jobItems.intitule, jobItems.description, jobItems.dateCreation, jobItems.dateActualisation, jobItems.typeContrat,
        jobItems.entreprise.nom, jobItems.origineOffre.urlOrigine], (error) => {
            if (error != null)
                logger.error(error, "DATABASE");
        });
    }

    ////////////////////////////////////////////
    //        List all ID from zone
    ////////////////////////////////////////////

    getJobIDForZone(zone) {

        this.jobIDList = [];

        let promise = new Promise((resolve, reject) => {

            if (!this.databasePTR) {
                reject("database not open");
                return;
            }

            this.databasePTR.all("SELECT jobID FROM job_offers WHERE zoneID = $zoneID", { $zoneID: zone }, (error, rows) => {
                rows.forEach(row => {
                    this.jobIDList.push(row.jobID);
                });

                resolve(this.jobIDList);
            });

        })

        return promise;
    }

    ////////////////////////////////////////////
    //        Generate report for zone
    ////////////////////////////////////////////
    generateReport(zone) {
        const folderName = this.createFolderIfNotExist(zone);

        let promise = new Promise((resolve, reject) => {
            this.generateContractStats(zone).then((contractTable) => {
                this.generateCompanyStats(zone).then((companyTable) => {

                    fs.writeFileSync(folderName + '/company.txt', companyTable.toString());
                    fs.writeFileSync(folderName + '/contract.txt', contractTable.toString());

                    resolve();
                });
            });
        });

        return promise;
    }


    generateCompanyStats(zone) {
        let promise = new Promise((resolve, reject) => {
            let companyTable = new AsciiTable3('Statistique des entreprises')
                .setHeading('Nom', 'Nombre d\'offres')
                .setAlign(3, AlignmentEnum.CENTER);

            this.databasePTR.all(`SELECT companyName, COUNT(companyName) AS count FROM job_offers 
                                  WHERE zoneID = $zoneID GROUP BY companyName HAVING count > 0 ORDER BY count DESC`, { $zoneID: zone }, (error, rows) => {

                rows.forEach(row => { companyTable.addRowMatrix([[row.companyName, row.count]]); });
                resolve(companyTable);

            });
        });

        return promise;
    }

    generateContractStats(zone) {
        let promise = new Promise((resolve, reject) => {
            let contractTable = new AsciiTable3('Statistique des contrats')
                .setHeading('Type de contrat', 'Nombre')
                .setAlign(3, AlignmentEnum.CENTER);

            this.databasePTR.all(`SELECT contractType, COUNT(contractType) as count FROM job_offers 
                                WHERE zoneID = $zoneID GROUP BY contractType`, { $zoneID: zone }, (error, rows) => {

                rows.forEach(row => { contractTable.addRowMatrix([[row.contractType, row.count]]); });

                resolve(contractTable);
            });
        });

        return promise;
    }

    createFolderIfNotExist(zone) {
        const lDate = new Date();
        const lFolderName = `${logger.addLeadingZero(lDate.getDate())}-${logger.addLeadingZero(lDate.getMonth() + 1)}-${lDate.getFullYear()}`;

        let city = config.getNameForZoneID(zone)

        if (!fs.existsSync('./stats/' + city))
            fs.mkdirSync('./stats/' + city)

        if (!fs.existsSync('./stats/' + city + '/' + lFolderName))
            fs.mkdirSync('./stats/' + city + '/' + lFolderName);

        return './stats/' + city + '/' + lFolderName;
    }

}

module.exports = new JobDatabase;