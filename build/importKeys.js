const fs = require('fs');
const https = require('https');

const basePrefix = 'https://storage.googleapis.com/admin-asset-keys/';

const cloudStorageKeyFileName = 'warriors-chasecenter-85d2c8cb1f38.json';
const firebaseKeyFileName = 'warriors-chasecenter-firebase-adminsdk-y6kgj-1aa2461960.json';

const cloudStorageFileStream = fs.createWriteStream(`./__auth__/${cloudStorageKeyFileName}`);
const firebaseKeyFileStream = fs.createWriteStream(`./__auth__/${firebaseKeyFileName}`);

// Get Cloud Storage Key
https.get(`${basePrefix}${cloudStorageKeyFileName}`, (response) => {
    response.pipe(cloudStorageFileStream);
    console.log('Retrieved the cloud storage key');
});

// Get Firebase Admin Key
https.get(`${basePrefix}${firebaseKeyFileName}`, (response) => {
    response.pipe(firebaseKeyFileStream);
    console.log('Retrieved the firebase admin key');
});
