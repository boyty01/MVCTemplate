/**
 * @module DatabaseInit 
 * Initialises the database schema with the required tables. Should not be used as part of the main application and is only invoked during initial setup.
 */

const  mysql2 = require("mysql2/promise");
const HashUtility = require("../utility/HashUtility.js");

module.exports = class DatabaseSetup {
    
    constructor() {}

    /** Create the schema for first time install. Will fail if the schema already exists. */
    static async install() {

        var con = await mysql2.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD
        });

       
        const [data] = await con.execute(`SHOW DATABASES LIKE '${process.env.DATABASE_SCHEMA_NAME}'`);
        
        if(data[0] !== undefined) {            
            console.log(data);
            console.log("an existing database was found. Aborting setup.");
            process.exit();
        }
        
        await con.execute(`
        CREATE SCHEMA ${process.env.DATABASE_SCHEMA_NAME};`);

        await con.query(`
        USE ${process.env.DATABASE_SCHEMA_NAME};`);

        await con.execute(`
        CREATE TABLE user (
            userId int AUTO_INCREMENT,
            username varchar(30) UNIQUE,
            hashedPassword varchar(60),
            accountLevel TINYINT(1),
            PRIMARY KEY (userId)
            );
        `);        
        
        console.log("Database setup successful.");

        con.close();
    }

}