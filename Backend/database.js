// Promise 객체 반환, 비동기 async await
const mysql = require("mysql2/promise");
const {databaseSecret} = require("./secret");

exports.pool = mysql.createPool(databaseSecret);