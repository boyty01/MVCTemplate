/**
 * @module
 * User controller. All functions in this module require http request and response objects as parameters and will handle sending the http response internally.
 * Once invoking these functions, you should assume that the response object has been sent already and you should not attempt to use it again.
 */

const User = require("../model/User.js");

/**
 * Create a new user from an api request. request.body must include username, password and accountLevel attributes.
 * @function createUser()
 * @param {object} req http request object 
 * @param {object} res http response object
 */
function createUser(req, res) {
    try {
        User.createUser(req.body.username, req.body.password, req.body.accountLevel)
            .then((data) => res.send(data));
    }
    catch (e) {
        res.status(500).send();
    }
};

/**
 * Authenticate a user from an api request. request.body must include username and password.
 * @function authenticateUser
 * @param {object} req http request object 
 * @param {object} res http response object
 */
function authenticateUser(req, res) {
    try {
        User.authenticateUser(req.body.username, req.body.password)
            .then((data) => {
                if (data.success) {
                    res.status(200).send(data.user);
                    return;
                }
                res.status(401).send();
            });
    }
    catch (e) {
        res.status(500).send();
    }
};

/**
 * Fetch a list of all user records in the user table.
 * @function getAllUsers
 * @param {object} req http request object
 * @param {object} res http response object
 */
function getAllUsers(req, res) {
    try {
        User.getAllUsers()
            .then(data => { res.status(200).send(data) });
    }
    catch (e) {
        res.status(500).send();
    }
};

/**
 * Delete a user record by username
 * @function deleteUsername
 * @param {object} req http request object
 * @param {object} res http response object
 */
function deleteUsername(req, res) {
    try {
        User.deleteUsername(req.body.username)
        .then(result => {
                res.status(204).send();            
        });
    }
    catch(e) {
        res.status(500).send();
    }
};

/**
 * Delete a user record by their userId
 * @function deleteUserId
 * @param {object} req http request object
 * @param {object} res http response object
 */
function deleteUserId(req, res) {
    try {
        User.deleteUserId(req.body.userId)
        .then(result => {
            res.status(204).send();
        });
    }
    catch(e) {
        res.status(500).send();
    }
}

function getUser(req, res) {
    try {
        User.getByUsername(req.body.username)
            .then(result => {
                res.status(200).send(JSON.stringify(result));
            });
    }
    catch(e) {
        res.status(500).send();
    }
}

module.exports = {
    createUser,
    authenticateUser,
    getAllUsers,
    deleteUsername,
    deleteUserId,
    getUser
}