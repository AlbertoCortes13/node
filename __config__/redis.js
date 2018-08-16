const redisOptions = {
    host: process.env.GSW_REDIS_HOST || 'localhost',
    port: process.env.GSW_REDIS_PORT || 6379,
    retry_strategy(options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // console.log('Redis connection to ' + host + ':' + port + ' failed,The server refused the connection');
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.times_connected > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.max(options.attempt * 100, 3000);
    },
};

module.exports = {
    getRedisOptions: () => redisOptions,
};
