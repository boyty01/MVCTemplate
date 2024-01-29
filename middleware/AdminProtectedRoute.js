/**
 * @middleware 
 * Highest level authenticated route. Only accounts flagged with administrator level can access routes protected by this middleware. Calls validateAdministrator on the User
 * CDO and continues if valid. returns 401 if unauthorised.
 */

const Router = require("express").Router();
const User = require("../model/User.js");

Router.use(function(req, res, next) {
    if(!req.session) {
        res.status(401).send();
        return;
    }
    User.validateAdministrator(req.session.user.userId, req.session.user.username)
        .then(result => {
            if(!result) {
                res.status(401).send();
                return;
            }
            next();
            return;
        });
});

module.exports = Router;