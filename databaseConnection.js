const mysql = require('mysql2');

const is_heroku = process.env.IS_HEROKU || false;

const dbConfigHeroku = {
    host: "bv2rebwf6zzsv341.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "qb6s5t82mu083vug",
    password: "yt4pw6o1qf1rgw6l",
    database: "vqezxpumr5ni82we",
    multipleStatements: false,
    namedPlaceholders: true
};

const dbConfigLocal = {
    host: "localhost",
    user: "IDSP_Dreamcatcher_user",
    password: "password",
    database: "IDSP_Dreamcatcher",
    multipleStatements: false,
    namedPlaceholders: true
};

if (is_heroku) {
    var database = mysql.createPool(dbConfigHeroku).promise();
}
else {
    var database = mysql.createPool(dbConfigLocal).promise();
}

module.exports = database;


