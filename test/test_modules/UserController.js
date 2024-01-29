const UserController = require("../../controller/UserController.js");
var assert = require("assert");


module.exports = 
describe('UserController', function() {
    
    describe("create", function() {

        it("should create a user successfully", function() { 

            var data;
            function response (res) {
                data = res;
                assert.equal(data.data);
            }

           UserController.createUser(
            {
                body: {
                    username:"testUser",
                    password:"testPassword123"
                }
            }, {
                status:0,
                send: response
                }                                                       
            )
        });

    });

});
            