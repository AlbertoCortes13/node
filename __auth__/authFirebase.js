const admin = require('firebase-admin');
const firebase = require('firebase');
const serviceAccount = require('./warriors-chasecenter-firebase-adminsdk-y6kgj-1aa2461960.json');
const log = require('../__utils__/logger');

const config = {
    apiKey: 'AIzaSyBKevWUSC1J1-glEdRZtNBZA5ALvigQvrE',
    authDomain: 'warriors-chasecenter.firebaseapp.com',
    databaseURL: 'https://warriors-chasecenter.firebaseio.com',
    projectId: 'warriors-chasecenter',
    storageBucket: 'warriors-chasecenter.appspot.com',
    messagingSenderId: '985801575389',
};

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://warriors-chasecenter.firebaseio.com',
});

firebase.initializeApp(config);

module.exports = {

    generateUserToken: async (email) => {
        try {
            const user = await admin.auth().getUserByEmail(email);
            const token = await admin.auth().createCustomToken(user.uid);
            return token.toString();
        } catch (e) {
            log.debug('Could not generate User Token');
            log.error(e);
            return e;
        }
    },
    authenticateUser: async (cred) => {
        try {
            let response = await firebase.auth().signInWithEmailAndPassword(cred.email, cred.password).then(user => ({ user })).catch(error => ({ error }));
            response = await Promise.resolve(response);
            return response;
        } catch (e) {
            log.error(`${e.stack}`);
            return ({
                error: {
                    message: 'Internal Server Error',
                },
                code: 500,
            });
        }
    },

    getUserByEmail: async (email) => {
        try {
            const val = await admin.auth().getUserByEmail(email);
            return val;
        } catch (e) {
            log.error(`${e.stack}`);
            return false;
        }
    },

    createNewUser: async (newUser) => {
        try {
            const user = await admin.auth().createUser(newUser);
            return user;
        } catch (e) {
            log.error(`ERROR CREATING NEW USER: ${e.stack}`);
            return e;
        }
    },

    updateUser: async (uid, newUser) => {
        try {
            const user = await admin.auth().createUser(newUser);
            return user;
        } catch (e) {
            log.error(`${e.stack}`);
            return e.message;
        }
    },

    deleteUser: async (uid) => {
        admin.auth().deleteUser(uid)
            .then(() => {
                log.info('Successfully deleted user');
            })
            .catch((error) => {
                log.error('Error deleting user:', error);
            });
    },

};
