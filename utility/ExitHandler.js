/**
 * ExitHandler binds a custom function to handle clean shutdown of the server, allowing for logging the shutdown and other potential necessities before exiting out.
 * This only needs to be required by the entry point file and no functions need to be explicitly invoked. 
 */

const Logger = require("../log/Logger.js");

function shutdownRoutine(code, eventName, data) {    
    if(eventName === "exit") Logger.logSync("server", "low", "server shutdown.");

    if(eventName === "SIGINT" || eventName === "SIGTERM") Logger.logSync("server", "low", `Server shutdown signal from SIG; ${code}`);

    if(eventName === "uncaughtException") 
    {
        Logger.logSync("server", "low", `uncaught exception causing server shutdown: ${code}`);
        console.log(code);
    }
    process.exit();
}

process.on("exit", (code) => {shutdownRoutine(code, "exit", null)});
process.on("SIGINT", (code) => {shutdownRoutine(code, "SIGINT", null)});
process.on("SIGTERM", (code) => {shutdownRoutine(code, "SIGTERM", null)});
process.on("uncaughtException", (code) => {shutdownRoutine(code, "uncaughtException", null)});
