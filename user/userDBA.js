const log = require('../__utils__/logger');
const seqModels = require('../__utils__/sequelizeConf');

// TODO: Identify on how to destructure this object properly
// eslint-disable-next-line prefer-destructuring
const userModel = seqModels.user;
seqModels.sequelize.authenticate().then(() => {
    log.info('Connection has been established successfully.');
})
    .catch((err) => {
        log.error('Unable to connect to the database:', err);
    });


module.exports = {

    getAllUsers: async () => {
        log.info('Getting all users');
        try {
            let res = await userModel.findAll();
            // This map changes from sqlize obj to json object
            res = res.map(r => (r.toJSON()));
            return res;
        } catch (error) {
            log.error(`Can't get all users from Postgres: \n${error.message}`);
            return error;
        }
    },

    getUserFromDbById: async (id) => {
        try {
            const sqlzUser = await userModel.findOne({
                where: {
                    fbId: id,
                },
            });
            return sqlzUser.get({
                plain: true,
            });
        } catch (error) {
            log.error(`Couldn't get user by id: ${id}\n${error.message}`);
            return error;
        }
    },

    getUserFromDbByEmail: async (email) => {
        try {
            const sqlzUser = await userModel.findOne({
                where: {
                    email,
                },
            });
            return sqlzUser.get({
                plain: true,
            });
        } catch (error) {
            log.error(`Couldn't get user by email: ${email}\n${error.message}`);
            return error;
        }
    },

    addUserToDb: async (user) => {
        try {
            const createdUser = userModel.create(user);
            return createdUser;
        } catch (error) {
            log.error(`Couldn't create user: ${user}`);
            return error;
        }
    },

    updateUserInDb: async (fbId, user) => {
        try {
            const updatedUser = userModel.update(user, {
                where: {
                    fbId,
                },
            });
            return updatedUser.get({
                plain: true,
            });
        } catch (error) {
            log.error(`Couldn't update user: ${user}`);
            return error;
        }
    },
    removeUserFromDbById: async fbId => userModel.destroy({
        where: {
            fbId,
        },
    }),

    removeUserFromDbByEmail: async email => userModel.destroy({
        where: {
            email,
        },
    }),

};
