// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

require('dotenv').config();

// this code is required for deployment to heroku
let sequelize;

// when deployed, app will have access to heroku's process.env.JAWSDB_URL so
// it will use that to connect
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    // otherwise use our localhost
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
    });
}

module.exports = sequelize;