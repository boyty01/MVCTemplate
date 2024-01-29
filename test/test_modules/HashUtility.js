var assert = require("assert");
const HashLib = require("../../utility/HashUtility.js");

module.exports = 
describe('HashUtility', function() {
    
    describe("Hashing", function() {

        it("Should hash and compare the given password successfully", async function() {
            
            var hashedRes = await HashLib.makePassword("testPassword");
            var res = await HashLib.validatePassword("testPassword", hashedRes);
            assert.equal(res, true);
            });
        });
        
        describe("Authorising", function () {

            it("Should successfully validate a previously hashed password against a separate plain text string of the same value.", async function () {
                var initialPass = "goodPassword";
                var secondPass = "goodPassword";

                var hashedRes = await HashLib.makePassword(initialPass);
                var res = await HashLib.validatePassword(secondPass, hashedRes);
                assert.equal(res, true);
            });

            it("Should fail to validate a previously hashed password against a different plain text string.", async function () {
                var initialPass = "goodPassword";
                var secondPass = "badPassword";

                var hashedRes = await HashLib.makePassword(initialPass);
                var res = await HashLib.validatePassword(secondPass, hashedRes);
                assert.equal(res, false);
            });

        })
    });
