# Simple MVC Template

Template version of MVC system in ExpressJs. A common starting ground for many of my API works, includes a MySQL database deployer script to setup the schema on first runs and general user login and authentication routes with appropriate models and controllers. Note, this template requires additional setup to function properly - namely sessions must be handled appropriately for the middleware to function, or the middleware must be removed from all routes to bypass them. Session handling has explicitly been avoided from this template to simplify customisation. 

All modules and functions are commented following JSDoc standard.

## Models

### User Model
User module that represents both a User record and acts as a model for all user table interactions.  Contains a list of static functions for interacting with the database, and a simple factory that instantiates User objects where required. For basic security, 
the User class constructor has been made private (within the constriants of JavaScript) and instances of a User cannot be created outside of the User class by calling new User().  Access to instanced User objects can only be granted as a result from an appropriate
static function. 

To interact with the database, users should call the appropriate function on the class default object (using User.[staticfunction]). The following static functions are available in the template:

createUserRecord(username, rawPassword, accountLevel) 

validateUsername(username)

validatePassword(rawPassword)

validateHash(hash)

validateAdministrator(userId, username)

authenticateUser(username, password)

deleteUsername(username)

deleteUserId(userId)

getAllUsers()

## Controllers

### User Controller
The user controller follows the standard MVC setup for manipulating the User model. All functions in the controller expect input parameters of http request and response objects and handle the http response internally. Once a controller function is invoked, it is 
expected that the response is handled and should therefore be considered unusable thereafter. Parameters required from the body of a request should follow the same naming convention as the User model and should be at the top level of the body. e.g a username that is required
as part of a POST request should be found at req.body.username 

The following functions are implemented in the User Controller: 

createUser(req, res)

authenticateUser(req, res)

getAllUsers(req, res)

deleteUsername(req, res)

deleteUserId(req, res)

getUser(req, res)


## Views
No view handling has been included in this system template to allow for completely custom implementation from whatever render method is prefered.  For web app frameworks such as ReactJS, you can just serve the front end directly from express following the api routes with express.use("*", express.static(<publicpath>)).  For conventional web pages, you can add custom routes and return the appropriate views in whatever suits your workflow. 

## Other

### Middleware
Note: Included middleware assumes that session information is stored at req.session, although this template does not include configuring or storing session data to allow for custom implementations / libraries in any future forks, it's highly likely that express-session 
would be the go-to.

included middleware:

AdminProtectedRoute() 
Admin protected route asserts that the account making the request is of Administrator level. any account below this level will receive a 401.

SelfProtectedRoute()
Self protected route asserts that the user making the request matches the userId parameter in the route. This is to allow users to modify their own data, but not others - unless they are an administrator.

### SQL connection Pool
A single module is included that manages the connection pool using mysql2.  All existing connection queries request a connection from this pool using pool.getConnection() and execute from it. It's standard practice across this app to use this connection pool rather than creating a new connection whenever required. You can import this module from /database/ConnectionPool.

### Log files
A Logger module is included and can be imported to simplify server logging. log categories can be added to LogDefinitions.json to log messages into separate .txt files for convenience.  
When declaring a log message, a verbosity level must be specified which allows for the system to filter out any messages that do not fit within the global verbosity range. The maximum verbosity can be set in the .env under LOG_VERBOSITY.  See LogDefinitions for the appropriate tags.

