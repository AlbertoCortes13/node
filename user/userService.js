/*
Service level of user module
Layer supports high level business rules and Math
*/
const redis = require('redis');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const log = require('../__utils__/logger');
const redisConfig = require('../__config__/redis');
const userDba = require('./userDBA.js');
const auth = require('../__auth__/authFirebase.js');
const authStorage = require('../__auth__/authStorage.js');
const responseObject = require('../__utils__/responseObject');

const redisClient = redis.createClient(redisConfig.getRedisOptions());

// Redis
redisClient.on('error', (err) => {
    log.error(`Error: ${err}`);
});
redisClient.on('connect', () => {
    log.info('Redis client connected');
});


module.exports = {

    getAllUsers: async () => {
        const users = await userDba.getAllUsers();
        if (users instanceof Error) {
            return responseObject('Couldn\'t get all users', 500);
        }
        return responseObject(users, 200);
    },

    addNewUser: async (user) => {
        const res = await userDba.addUserToDb(user);
        return res;
    },

    removeExistingUserById: async (id) => {
        const isDeleted = await userDba.removeUserFromDbById(id);
        if (isDeleted) {
            return responseObject(isDeleted, 200);
        }
        return responseObject('Nothing was deleted', 409);
    },

    removeExistingUserByEmail: async (email) => {
        const isDeleted = await userDba.removeUserFromDbByEmail(email);
        if (isDeleted) {
            return responseObject(isDeleted, 200);
        }
        return responseObject('Nothing was deleted', 409);
    },

    getUserById: async (id) => {
        const user = await userDba.getUserFromDbById(id);
        if (user instanceof Error) {
            return responseObject('User not Found.', 401);
        }
        return responseObject(user, 200);
    },

    getUserByEmail: async (email) => {
        const user = await userDba.getUserFromDbByEmail(email);
        if (user instanceof Error) {
            return responseObject('User not Found.', 401);
        }
        return responseObject(user, 200);
    },

    getFBUserByEmail: async (email) => {
        const userDb = await userDba.getUserFromDbByEmail(email);
        userDb.uid = userDb.fbid;
        return userDb;
    },

    updateExistingUser: async (fbid, user) => {
        await userDba.updateUserInDb(fbid, user);
        // const updatedUserFB = await auth.updateUser(dbUser.uid, cred);
        // TODO: Keep one user, or compare from FB and Postgress to either rollback or retry
        // if (updatedUserDb.message) {
        //     const res = {
        //         error: updatedUserDb,
        //         code: 409,
        //     };
        //     return res;
        // }
        // const res = {
        //     response: await userDba.getUserFromDbByEmail(cred.email),
        //     code: 200,
        // };
        // redisClient.set(cred.token, JSON.stringify(updatedUser), redis.print);

        // return responseObject('User wasn\'t updated.', 409);
        const updatedUser = await userDba.getUserFromDbById(fbid);
        // TODO: This is a falsy check, maybe the change did happend
        if (updatedUser instanceof Error) {
            return responseObject('Couldn\'t update the User', 409);
        }
        return responseObject(updatedUser, 200);
    },

    // User account
    createUserAccount: async (newUser) => {
        log.verbose('Creating user account...');
        const newUserObj = newUser;
        const { firstName, lastName } = newUserObj;
        log.verbose(`Getting user from Firebase with email: ${newUserObj.email}`);
        const existingUser = await auth.getUserByEmail(newUserObj.email);
        if (!existingUser) {
            log.verbose('User doesn\'t exist in firebase, creating...');
            newUserObj.displayName = `${newUser.firstName} ${newUser.lastName}`;
            if (newUserObj.photoUrl) {
                const fileName = `${newUserObj.displayName.replace(' ', '-')}-${uuidv1()}.png`;
                const base64Data = newUserObj.photoUrl.replace(/^data:image\/png;base64,/, '');
                const tempLoc = `./images/temp/${fileName}`;
                log.verbose(`Writing file to FS in ${tempLoc}`);
                fs.writeFile(tempLoc, base64Data, 'base64', (err) => {
                    if (err) {
                        log.error(`Error writing file to filesystem ${err}`);
                    }
                });
                log.verbose(`Stroring image in ${tempLoc}`);
                newUserObj.profilePhoto = await authStorage.storeImageAndReturnUrl(tempLoc);
                fs.unlink(tempLoc, (err) => {
                    if (err) throw err;
                    log.info(`${tempLoc} was deleted`);
                });
                delete newUserObj.photoUrl;
            }

            const record = await auth.createNewUser(newUserObj);
            if (record instanceof Error) {
                return responseObject(record, 409);
            }
            // delete newUserObj.password;
            newUserObj.id = uuidv1();
            newUserObj.fbId = record.uid;
            newUserObj.firstName = firstName;
            newUserObj.lastName = lastName;
            const response = userDba.addUserToDb(newUserObj);
            if (!response) {
                return responseObject(response.error, 500);
            }
            const token = await auth.generateUserToken(newUserObj.email);
            return responseObject({
                token,
                user: await userDba.getUserFromDbByEmail(newUserObj.email),
            }, 200);
        }
        log.verbose('User does exists');
        const res = responseObject('Duplicate resource found.', 409);
        return res;
    },

    login: async (cred) => {
        const response = await auth.authenticateUser(cred);
        let res;
        if (response.error) {
            res = responseObject(response.error.message, 401);
        } else {
            const token = response.user.user.refreshToken;
            res = responseObject({
                token,
                user: await userDba.getUserFromDbByEmail(cred.email),
            }, 200);
        }
        return res;
    },

    logout: async (token) => {
        log.debug(token);
        return responseObject('User has been logged out.', 200);
    },

    getUserInfo: async (email) => {
        const user = await auth.getUserByEmail(email);
        let res;
        if (user) {
            res = responseObject(user, 200);
        } else {
            res = responseObject({
                message: 'User not found',
                code: 401,
            }, 401);
        }
        return res;
    },

    getVisitorInformation: async (token) => {
        log.debug(`Token ${token}`);
        const user = redisClient.get(token);
        let res;
        if (user) {
            res = responseObject({
                isMediaMember: user.isMediaMember,
                isSeasonTicketHolder: user.isSeasonTicketHolder,
            }, 200);
        } else {
            res = responseObject({
                message: 'User not found',
                status: 401,
            }, 401);
        }
        return res;
    },
};
