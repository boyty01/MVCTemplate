/** 
 * First time setup script.  attempts to create the schema specified in the DatabaseInit model and prompts for the admin account setup. if the schema already exists
 * the script will exit without making changes. For security reasons, there is no way to drop/replace the schema from this script. 
 */

require("dotenv").config();
const setup = require("./model/DatabaseInit.js");
const User = require("./model/User.js");

const readline = require("node:readline/promises").createInterface({
    input: process.stdin,
    output:process.stdout
});

var username;
var password;

async function requestUsername() {
    username = await readline.question("Please provide a username for the administrator account");
}

async function requestPassword() {
    readline.stdoutMuted = true;
    const pass = await readline.question("please type a password");
    password = pass;
    readline.stdoutMuted = false;
}

async function assertPassword() {

    console.log(password.length);
    if(password.length < User.passwordMinimumLength) {
        console.log("Invalid password. Minimum password length is " + User.passwordMinimumLength);
        return false;
    }
    readline.stdoutMuted = true;
    const answer = await readline.question("please retype password");
    if(answer === password) return true;
    readline.stdoutMuted = false;
    console.log("Password's did not match. Please try again.");
    return false;
}

async function requestUserDetails() {
    await requestUsername();
    
    var passwordVerified = false;

    while(!passwordVerified) {
        await requestPassword();
        passwordVerified = await assertPassword();
    }

    if(passwordVerified)
    {
        console.log("verifying " + username + " with pass " + password);
        if(!User.validateUsername(username) || !User.validatePassword(password)) 
        {
            console.log("Failed to validate username / password in line with User config. Admin account was not created.");
            return;
        }
        
        var data = await User.createUser(username, password, process.env.ADMIN_ACCOUNT_LEVEL);

        if(data.error) {
            console.log(data.errorCode);
            process.exit();
        }

        console.log("admin setup complete.");
        process.exit(0);
    }

    
}

async function run() {
    await setup.install();
    await requestUserDetails();
}

run();