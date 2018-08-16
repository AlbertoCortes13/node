/*

    GSW - Microservices Application Root

*/
const express = require('express');

// Express
const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

// Swagger
const swaggerUi = require('swagger-ui-express');
const log = require('./__utils__/logger');

// Deploy proper app
const localSwaggerDocument = require('./swagger.json');
const deployedSwaggerDocument = require('./deployed.swagger.json');

const swaggerDocument = (process.env.APP_DEPLOYED) ? deployedSwaggerDocument : localSwaggerDocument;
/* Routing Variables */

log.debug('Setting models...');
app.set('models', require('./__utils__/sequelizeConf'));

// Core Routes
const userRoutes = require('./user/routes');
// homepageRoutes = require('./homepage/routes'),
// accountRoutes = require('./account/routes'),

// NBA API Routes
const nbaAPIRoutes = require('./nba/routes');

app.enable('trust proxy');

/* Body Parser */
app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(bodyParser.json());

/* Router URL Imports */

app.use('/users', userRoutes);
app.use('/nba', nbaAPIRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, host);
log.info(`GSW Microservices API served on port ${port}`);
