/**
 * @middleware
 * Used to limit routes to only the owning User. the session user objects id must match the ID of the user in the route path. 
 */

const Router = require("express").Router();
const User = require("../model/User.js");

Router.use(function (req, res, next) {

    // No session exists.
    if(!req.session) {
        res.status(401).send();
        return;
    }

    //malformed request
    if(!req.params.userId) {
        res.status(400).send();
        return;
    }

    // if trying to modify a different user to ourselves when not an admin.
    if(req.params.id !== req.session.user.userId && !User.validateAdministrator(req.session.userId, req.session.username))
         {
        res.status(401).send();
    }

    next();
    return;    
});