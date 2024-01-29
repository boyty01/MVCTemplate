/** 
 * v1 handler for all User http requests.  Any and all middlewares appropriate to User routes should be applied here before forwarding the requests to the Controller.
 */

const Router = require("express").Router();
const UserController = require("../../../controller/UserController.js");
const AdminProtectedRoute = require("../../../middleware/AdminProtectedRoute.js");
const selfProtectedRoute = require("../../../middleware/SelfProtectedRoute.js");

/** 
 * @protected. Admin only.
 * Get users root. Query all users.  */
Router.get("/", AdminProtectedRoute, (req, res) => {UserController.getAllUsers();});

/**
 * @protected get a specific user. This is limited to self User or administrator by default for security purposes, to prevent all users from being able to request
 * any other user. Modify if access should be allowed to other user info. 
 */
Router.get("/:userId", selfProtectedRoute, (req, res) => {});

/** 
 * Create a new user
 */
Router.put("/:userId", (req, res) => {UserController.createUser(req, res);});

module.exports = Router;