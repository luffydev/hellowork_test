
const clc = require('cli-color');
const fs = require('fs');

function createFolderIfNotExist() {
    const lDate = new Date();
    const lFolderName = `${addLeadingZero(lDate.getDate())}-${addLeadingZero(lDate.getMonth() + 1)}-${lDate.getFullYear()}`;

    if (!fs.existsSync('./logs/' + lFolderName))
        fs.mkdirSync('./logs/' + lFolderName);

    return lFolderName;
}

function getTimestamp() {
    const lDate = new Date();
    return `[${addLeadingZero(lDate.getDate())}-${addLeadingZero(lDate.getMonth() + 1)}-${lDate.getFullYear()} ${addLeadingZero(lDate.getHours())}:${addLeadingZero(lDate.getMinutes())}:${addLeadingZero(lDate.getSeconds())}] `
}

function info(pMessage, pService = 'HTTP') {

    if (!pMessage || !pService)
        return;

    const lFolderName = createFolderIfNotExist();
    const lTimestamp = getTimestamp();

    fs.appendFileSync('./logs/' + lFolderName + '/logs.txt', lTimestamp + pMessage + '\n');
    console.log(clc.bgCyanBright.black(`[${pService}][INFO]`) + ` -> ${pMessage} `);
}

function success(pMessage, pService = 'HTTP') {

    if (!pMessage || !pService)
        return;

    const lFolderName = createFolderIfNotExist();
    const lTimestamp = getTimestamp();

    fs.appendFileSync('./logs/' + lFolderName + '/logs.txt', lTimestamp + pMessage + '\n');
    console.log(clc.bgGreenBright.black(`[${pService}][SUCCESS]`) + ` -> ${pMessage} `);
}

function error(pMessage, pService = 'HTTP') {

    if (!pMessage || !pService)
        return;

    const lFolderName = createFolderIfNotExist();
    const lTimestamp = getTimestamp();

    fs.appendFileSync('./logs/' + lFolderName + '/logs.txt', lTimestamp + pMessage + '\n');
    console.log(clc.bgRedBright.black(`[${pService}][ERROR]`) + ` -> ${pMessage} `);
}

function write(pMessage) {

    if (!pMessage)
        return;

    const lFolderName = createFolderIfNotExist();
    const lTimestamp = getTimestamp();

    fs.appendFileSync('./logs/' + lFolderName + '/logs.txt', lTimestamp + pMessage + '\n');
    console.log(clc.bgWhiteBright.black('[SYS][PROMPT]') + ' -> ' + pMessage);
}

// function for adding leading zero on number < 10
function addLeadingZero(number) {
    return number < 10 ? `0${number}` : number;
}

module.exports = {
    info,
    success,
    error,
    write,
    addLeadingZero
}