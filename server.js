/**
 * MVC API server. This template includes a basic setup for an authenticated session using a MySQL database. For enhanced compatibility with different view systems,
 * the "view" section of this MVC is not implemented. The response should be handled appropriately by the preferred toolchain, i.e. react, ejs etc, and their routes should
 * be implemented as required.  For web applications such as reactjs, you can add app.use("*", express.static("[public folder path]")) to serve the public directory after all 
 * api routes have been defined.  For conventional pages, you can define paths for each route and return the views as needed. To modify the database, you should add all your
 * queries to the database initialisation in /model/DatabaseInit.js and run setup.js to create the new schema as per your requirements. 
 * 
 * Note this template does not handle SSL and you'll need to tweak this module to cater for http / https redirects if and when you have your certificates prepared. 
 */

require("dotenv").config();
const exitHandler = require("./utility/ExitHandler.js");
const express = require("express");
const Logger = require("./log/Logger.js");
const pool = require("./database/ConnectionPool.js");
const app = express();
const User = require("./model/User.js");




/** 
 *  Main entry point for application. Assert the database connection and initialise the listen server.
 * @function Init()
*/
async function init() {
    try {
        await pool.query(`use mvcexample;`)
            .then(() => {
                Logger.log("database", "low", "Database pool created");
            })            
            .then(() => {
                // init server
                app.listen(process.env.SERVER_PORT, () => {
                    Logger.log("server", "low", "Server online.");
                    console.log("server online");


                });
            });
    }

    catch (err) {
        if (err.code === "ER_BAD_DB_ERROR") {
            console.log("Error. Database not found. Have you run setup?");
            Logger.logSync("server", "low", "Error. Startup failed. Database not found. ");
            process.exit(0);
        }

        console.log(`Failed to init database pool.\nReason: ${err.code}\ndetail: ${err.sqlMessage}`);
        Logger.logSync("server", "low", `Failed to init database pool.\nReason: ${err.code}\ndetail: ${err.sqlMessage}`);
        process.exit(0);
    }
}

init();
