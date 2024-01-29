/**
 * @module User model. 
 * This module handles all database interaction requirements for the user table via the User class, and is commonly interacted with via the UserController. 
 * Database interaction functions are declared static and are not included in any instantiation of the User class.  Any rows retrieved from the user table are first instantiated into
 * User objects before being returned to the invoker.  
 * 
 * User instances cannot be directly instantiated outside of this module, and can only be created by the class itself via an appropriate
 * function call. If you need an instance of a User with the appropriate row data applied, you should invoke the appropriate function and consume the returned object(s). 
 * e.g. getAllUsers() will return User objects of all user rows in the database.
 */

const pool = require("../database/ConnectionPool.js");
const HashUtility = require("../utility/HashUtility.js");
const Logger = require("../log/Logger.js");

/**
 * @class
 * User object that represents a user row in the database when instantiated. Cannot be instantiated manually and can only be created internally
 * when returning valid data from the database. The default object contains all static functions for interacting with the user table should be used for application wide
 * interactions with the user table. Also contains any global user, non-environment level restrictions such as password requirements.
 */
class User {

    static usernameMinimumLength = 8;
    static usernameMaxiumLength = 30;
    static passwordMinimumLength = 8;

    // js workaround for disabling public constructor. 
    static #isConstructing = false;

    constructor(userId, username, accountLevel) {
        if(!User.#isConstructing) {
            throw new TypeError("Error Cannot manually instantiate a User object. Use User.createUserInstance()");
        }
        
        User.#isConstructing = false;
        this.userId = userId;
        this.username = username;
        this.accountLevel = accountLevel;        
    }

    /**
     * internal function for instantiating a User object. 
     * @private @static 
     * @param {} userId 
     * @param {*} username 
     * @param {*} accountLevel 
     * @returns 
     */
    static #createUserInstance(userId, username, accountLevel) {
        User.#isConstructing = true;
        const userInstance = User.#createUserInstance(userId, username, accountLevel);
        return userInstance;
    }

    /**
     * Create a user record in the user table. 
     * @static 
     * @function createUserRecord
     * @param {string} username the username to associate with the record
     * @param {string} rawPassword plain text password to hash into the record
     * @param {int} accountLevel the account level flag to give the account. 
     * @return {object} js object. includes object.error, object.errorCode and object.data fields. if create was successful, object.data field includes a new User object with
     * the appropriate user data included. 
    */
    static async createUserRecord(username, rawPassword, accountLevel) {

        if (!User.validateUsername(username)) {
            console.log("bad user");
            return {
                data: null,
                error: true,
                errorCode: "BAD_USER"
            }
        }

        const hash = await HashUtility.makePassword(rawPassword);

        if (!this.validateHash(hash)) {
            // some kind of hash failure!
            Logger.log("model", "low", `Failed to hash password when creating user ${username} - attempted to hash password ${rawPassword}`);

            return {
                data: null,
                error: true,
                errorCode: "HASH_ERROR"
            }
        }

        var con = await pool.getConnection();
        await con.execute(`
        INSERT INTO user(username, hashedPassword, accountLevel)
        VALUES(?,?,?);
        `, [username, hash, accountLevel]);

        var data = await con.execute(`
        SELECT * FROM user WHERE username = ?
        `, [username]);

        var retValue = {
            data: data ? User.#createUserInstance(data.userId, data.username, data.accountLevel) : null,
            error: data ? null : true,
            errorCode: data ? null : "REC_NOT_FOUND"
        };

        return retValue;
    }

    /** 
     * Validates a string that represents a username. asserting it meets requirements. 
     * @static
     * @function validateUsername
     * @param {string} username the username to assert.
     * @return {bool} true if the username meets requirements.
    */
    static validateUsername(username) {
        var regExp = new RegExp("^[a-z._]+$", "i");
        return (username.length > User.usernameMinimumLength && regExp.test(username) && username.length <= User.usernameMaxiumLength);
    }

    /**
     * Validates whether a raw password meets the minimum requirements for user passwords. Should be expanded to include all system specific requirements for passwords.
     * @static 
     * @function validatePassword
     * @param {string} rawPassword password to validate
     * @return {bool} whether the password passes validation.
     */
    static validatePassword(rawPassword) {

        if (rawPassword.length < User.passwordMinimumLength) {
            return [false, "MIN_LENGTH"];
        }

        return true;
    };

    /** 
     * Validate a given hash string by asserting its length to be the expected amount of characters. This does not 
     * validate a password, only that the hash seems to be valid. Expand this function to add more advanced checks if necessary.
     * @static 
     * @function validateHash
     * @param {string} hash the string to validate.
     * @returns {bool} whether it appears valid.
     */
    static validateHash(hash) {
        return (hash && hash.length === 60)
    };

    /**
     * Authenticate a user login via username and password.
     * @param {string} username username to authenticate
     * @param {string} password password to authenticate
     * @returns {object} response object includes object.success attribute. if success is true, 
     * also includes object.user attribute populated with an instance of User, with username and account level set.
     */
    static async authenticateUser(username, password) {
        var con = await pool.getConnection();
        var res = await pool.execute(`SELECT * FROM user WHERE username = ?`, [username]);
        if (res.length === 1) {
            var valid = await HashUtility.validatePassword(password, res[0].hash);
            if (valid) {
                return { success: true, user: User.#createUserInstance(res[0].userId, res[0].username, res[0].accountLevel) };
            }
        }
        return { success: false, user: null };
    }

    /**
     * Validate whether the given userId and username are associated with an administrator account.
     * @async
     * @function validateAdministrator
     * @param {int} userId The userId associated with the username to check. 
     * @param {*} username the username associated with the userId to check.
     */
    static async validateAdministrator(userId, username) {
        var con = await pool.getConnection();
        var res = await pool.execute(`SELECT * FROM user WHERE username = ? AND userId = ?`, [username, userId]);

        if (res.length === 0) return false;

        return res[0].accountLevel === process.env.ADMIN_ACCOUNT_LEVEL;

    }

    /**
     * delete a given user by their username.
     * @static @async @function deleteUsername 
     * @param {string} username the username to delete.
     * @return {bool} whether the query was successful
     */
    static async deleteUsername(username) {
        var con = await pool.getConnection();
        var res = pool.execute(`
        DELETE from user WHERE username = ?`, [username]);

        return res != 0;
    };


    /**
     *Get all user rows from the user table.
     * @static @async @function getAllUsers
     * @returns {array} array of Users
     */
    static async getAllUsers() {
        var con = await pool.getConnection();
        var res = await pool.execute(`
         SELECT * from user
        `);

        var userArray = [];
        res.forEach((elem, index) => {
            userArray.push(User.#createUserInstance(elem.userId, elem.username, elem.accountLevel));
        })

        return userArray;
    };


    /**
     * @static @async @function deleteUsername 
     *delete a given user by their userId
     * @param {string} userId the userId to delete
     * @return {bool} whether the query was successful
     */
    static async deleteUserId(userId) {
        var con = await pool.getConnection();
        var res = pool.execute(`
        DELETE from user WHERE userId = ?`, [userId]);
      
        return res != 0;
    };

};

module.exports = User;