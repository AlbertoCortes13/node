const Sequelize = require('sequelize');
const log = require('./logger');

const config = {
    user: process.env.SQL_USER || 'postgres',
    database: process.env.SQL_DATABASE || 'postgres',
    password: process.env.SQL_PASSWORD || 'naluds12',

    opts: {
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        pool: { // TODO
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },

        // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
        operatorsAliases: false,
    },
};

if (process.env.APP_DEPLOYED) {
    config.opts.host = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

log.info('initializing connection to db with sequelize');
const sequelize = new Sequelize(config.database, config.user, config.password, config.opts);

const models = [
    'user',
];
models.forEach((model) => {
    module.exports[model] = sequelize.import('../user/userModel');
});

module.exports.sequelize = sequelize;
