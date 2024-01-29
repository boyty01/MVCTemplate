/* @module Utility library to handle hash passwords using globally specified config. These functions are asynchronous due to the computational requirements of bcrypt.
* Supports callbacks for synchronous functions.
*/

const bcrypt = require("bcrypt");

/* Number of salt rounds to use when hashing a password */
const saltRounds = 10;

/**
*makePassword Helper Function that uses configured settings to hash the given plaintext password. Asynchronously 
* @async 
* @function makePassword
* hashes then returns the result in a specified callback or as return param in resolved promise.
* @param {string} plainTextPassword string of the password to hash.
* @param {function} callback to return hashed password to synchronous functions.
* @returns {Promise<string>} hashed password
*/
async function makePassword(plainTextPassword, callback = function(hash){} ) {
    
    console.log("hashing" + plainTextPassword);
    var hashed = await bcrypt.hash(plainTextPassword, saltRounds);
    callback(hashed);    
    return hashed;
}

/** 
* Helper function that asynchronously compares the given plaintext password for authorisation. 
* @async 
* @function validatePassword
* @param {string} plainTextPassword  the unencrypted password to validate
* @param {string} hashToCompare  the hash to compare with the plain text
* @param {function} callback  callback function. 
* @returns {Promise<bool>} whether password was valid.
*/ 
async function validatePassword(plainTextPassword, hashToCompare, callback = function(isValid = false){}) {
    
    const validMatch = await bcrypt.compare(plainTextPassword, hashToCompare);

    callback(validMatch);
    
    return validMatch;
}

module.exports = {
    makePassword, 
    validatePassword
}


