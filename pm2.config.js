//require('dotenv').config();
//const { environment } = require('./lib/config').cfg

var pm2Config = {
    "apps": [
        {
            "name": "poker-api-" + process.env.NODE_ENV,
            "script": "server.js",
            "exec_mode": "cluster_mode",
            "instances": "max",
            "time": true,
            //"error_file": "./logs/err.log",
            //"out_file": "./logs/out.log"
        }
    ]
}

module.exports = pm2Config;
