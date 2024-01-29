const fs = require("fs");
const logDef = require("./LogDefinitions.json");

/**The maximum verbosity to consider for logging. messages received with verbosity levels higher than this will be discarded.*/
var verbosityLimit = logDef.logVerbosity[process.env.LOG_VERBOSITY] || 100;

/**if true, all recorded logs will also be reported to the console.*/
var logToConsole = process.env.LOG_TO_CONSOLE === "true" ? true : false;

/**
* @Class Logger
* Static Class responsible for recording log data to the appropriate files. can be accessed anywhere and uses the verbosity defined when the module is initialised.
*/
module.exports = class Logger {
    
    constructor() {}

    /** 
    * @static @async @function log 
    * Handle a log request. filters messages based on their verbosity.  Messages that are more verbose than the defined global limit will get discarded. 
    * @param {string} type log type, should match a type defined in LogDefinitions to specify the correct path.
    * @param {string} verbosity The verbosity level of this message. ("low", "medium", "high", "veryHigh")
    * @param {string} message the message to record to the appropriate log.
    */
    static async log(type, verbosity, message) {
        
        // discard if the verbosity is higher than our set limit.
        if(verbosityLimit < logDef.logVerbosity[verbosity]) return;

        // discard of logtype not defined.
        if(logDef.logTypes[type] === undefined) return;
        
        var stampedMessage = `[${new Date().toUTCString()}]: ${message}\n`;

        fs.appendFile(logDef.logTypes[type], stampedMessage, (err) => {
            if(err){
                console.log(`Error creating a log entry:\n${err}`);
            }
        });

        if (logToConsole) {
            console.log(`[${type}]${stampedMessage}`);
        }
    }

    /**
     *  @static @async @function logSync
     * Record a new log synchronously. Warning: This method will block the main thread and is not recommended for use while the server is running normally.
     * You should only call this function when the server is performing shut-down protocols to ensure that the process doesn't exit before the task is completed. 
     * For general runtime logs, use the asynchronous log() function instead.
     * @param {string} type log type, should match a type defined in LogDefinitions to specify the correct path.
     * @param {string} verbosity The verbosity level of this message. ("low", "medium", "high", "veryHigh")
     * @param {string} message The message to record to the log.
     * @returns {null}
     */
    static logSync(type, verbosity, message) {
        // discard if the verbosity is higher than our set limit.
        if(verbosityLimit < logDef.logVerbosity[verbosity]) return;

        // discard of logtype not defined.
        if(logDef.logTypes[type] === undefined) return;
        
        var stampedMessage = `[${new Date().toUTCString()}]: ${message}\n`;

        fs.appendFileSync(logDef.logTypes[type], stampedMessage, (err) => {
            if(err){
                console.log(`Error creating a log entry:\n${err}`);
            }
        });

        if (logToConsole) {
            console.log(`[${type}]${stampedMessage}`);
        }
    }
    
    /** 
     * Change the global verbosity level. Verbosity level dictates the maximum verbosity level of a message to record to a log. Globally setting verbosity to low will filter
     * all but the most critical logs. Setting it to veryHigh effectively removes the filter and logs every log request made by the application.
    * @param {string} newVerbosity the new value to set the new verbosity to.
    * @return {null}
    */ 
    static changeVerbosity(newVerbosity) {

        if(logDef.logVerbosity[newVerbosity] !== undefined) 
            verbosityLimit = logDef.logVerbosity[newVerbosity];
    }


}




