const local = {
    user: 'postgres',
    host: '35.232.127.129',
    database: 'postgres',
    password: 'mgBCtj6twJ0yNhIM',
    port: 5432,
};
module.exports = {
    getDbConfig: async () => {
        if (process.env.ENVIRONMENT === 'develop') {
            console.log(process.env.ENVIRONMENT);
            return {
                user: 'postgres',
                host: '127.0.0.1',
                database: 'postgres',
                password: 'naluds12',
                port: 5432,
            };
        }
        return local;
    },
};
