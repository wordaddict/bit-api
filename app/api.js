const dotenv = require('dotenv');

dotenv.config();
const restify = require('restify');
const plugins = require('restify-plugins');
const corsMiddleware = require('restify-cors-middleware');


// service locator via dependency injection
const serviceLocator = require('../app/config/di');

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ['*'],
    allowHeaders: ['*'],
    exposeHeaders: ['*']
  })

const config = require('../app/config/settings');
const routes = require('./routes/index');

const server = restify.createServer({
    name: config.app_name,
    versions: ['1.0.0'],
});

server.pre(cors.preflight)
server.use(cors.actual)

// Connect to Mongo
serviceLocator.get('mongo');

// Connect to logger
const logger = serviceLocator.get('logger');


// set API versioning and allow trailing slashes
server.pre(restify.pre.sanitizePath());

// set request handling and parsing
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());

// setup Routing and Error Event Handling
routes(server, serviceLocator);


server.listen(config.api_server.port, () => {
  logger.info(`${server.name} listening at ${server.url}`);
});

module.exports = server;
