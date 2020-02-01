/**
 * Created by Adeyinka Micheal
 */


const config = require('./settings');
const serviceLocator = require('../lib/service_locator');

const MainService = require('../services/index');
const MainController = require('../controllers/index');

const winston = require('winston');
require('winston-daily-rotate-file');
const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;
/**
 * Returns an instance of logger for the SE App
 */
serviceLocator.register('logger', () => {

  const logger =  winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      ),
  
    defaultMeta: {service: 'bit-api'},
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/info.log', level: 'info' })
    
    ]
  })
  
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
      
    }));
  }
  return logger;
});


/**
 * Returns a Mongo connection instance.
 */

serviceLocator.register('mongo', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const connectionString =
    (!config.mongo.connection.username || !config.mongo.connection.password) ?
      `mongodb://${config.mongo.connection.host}:${config.mongo.connection.port}/${config.mongo.connection.dbProd}` :
      `mongodb://${config.mongo.connection.username}:${config.mongo.connection.password}` +
      `@${config.mongo.connection.host}:${config.mongo.connection.port}/${config.mongo.connection.dbProd}`;
  mongoose.Promise = bluebird;
  const mongo = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true } );
  mongo.then(() => {
      console.log('Mongo Connection Established', connectionString)
  }).catch(() => {
      console.log('Mongo Connection disconnected');
      process.exit(1);
  });

  return mongo;
});

/**
 * Creates an instance of the main Service
 */
serviceLocator.register('mainService', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const mongoclient = servicelocator.get('mongo');
  return new MainService(logger, mongoclient);
});

/**
 * Creates an instance of the main controller
 */
serviceLocator.register('mainController', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const mainService = servicelocator.get('mainService');
  return new MainController(logger, mainService);
});


module.exports = serviceLocator;
