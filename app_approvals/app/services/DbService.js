(function (module) {
    const dbService = module.exports;
    const mysql = require("mysql");
    const deasync = require("deasync");
    const fs = require("fs");
    const path = require("path");

    dbService.create = () => {

        const configPath = path.join(__dirname, "../conf/app.json");
        const appConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
        const dbPool = mysql.createPool(appConfig.dbConfig);

        return {

            getAppApprovals: () => {
                let appApprovals = null;
                dbPool.query('SELECT * from app_approval', function (error, results, fields) {
                    appApprovals = error ? [] : results;
                });
                deasync.loopWhile(() => !appApprovals);
                return appApprovals;
            }

        };

    }

})(module);
