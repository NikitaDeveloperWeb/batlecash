const Logger = require('./functions/logger.js');
const Mysql  = require('./functions/mysql.js');
const Config = require('./variables/config.js');

Mysql.Query(`SELECT * FROM settings`).then( (settings) => {

    Logger.info("∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼");
    Logger.info(`- Проект: ${Config.nameSite}`);
    Logger.info("- Скачано с v-h.su");
    Logger.info("∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼");

});

const app = require('./express/server.js');
