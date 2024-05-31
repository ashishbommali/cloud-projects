require('dotenv/config');
const Sequelize =require('sequelize');

'use strict';

const sequelize =new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        logging: false,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
    }
);

module.exports =sequelize;