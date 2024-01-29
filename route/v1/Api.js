/**
 * Top level for v1 /api paths. handles routing sub-paths to the appropriate router. New paths should be declared here and added to the router below. 
 * no http requests should be handled at this level. 
 */
const Router = require("express").Router();
const UserRoute = require("./user/UserRoute.js");

Router.use("/user", UserRoute);


module.exports = Router;