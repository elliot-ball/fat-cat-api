const { Pool } = require('pg'); // Enables querying postgresql DB
const { resolve } = require("path");

require("dotenv").config({
    path: resolve(process.cwd(), ".env"),
});
// Configure DB connection using values from .env
const pool = new Pool({
    host: process.env.PGFC_HOST,
    database: process.env.PGFC_DATABASE,
    user: process.env.PGFC_RW_USERNAME,
    password: process.env.PGFC_RW_PASSWORD,
    port: process.env.PGFC_PORT,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

module.exports.getAllCategories = () => {
    return pool.query(`
    select * from category
    `).then(result => {
        console.log(result.rows);
    }).catch(error => {
        console.log(error);
    });
}