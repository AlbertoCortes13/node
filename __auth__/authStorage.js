const Promise = require('bluebird');
const GoogleCloudStorage = Promise.promisifyAll(require('@google-cloud/storage'));

const storage = GoogleCloudStorage({
    projectId: 'warriors-chasecenter',
    keyFilename: './__auth__/warriors-chasecenter-85d2c8cb1f38.json',
});
const BUCKET_NAME = 'gsw-user-profile-images';
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/0.39.0/storage/bucket
const myBucket = storage.bucket(BUCKET_NAME);

// check if a file exists in bucket
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/0.39.0/storage/file?method=exists
const checkIfExists = async () => {
    const file = myBucket.file('myImage.png');
    file.existsAsync()
        .then((exists) => {
            if (exists) {
                // file exists in bucket
            }
        })
        .catch(err => err);
};


// upload file to bucket
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/0.39.0/storage/bucket?method=upload
const storeImageAndReturnUrl = async (tempLocation) => {
    const file = await myBucket.uploadAsync(tempLocation, { public: true });
    const getPublicThumbnailUrlForItem = `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`;
    return getPublicThumbnailUrlForItem;
};

module.exports = {
    storeImageAndReturnUrl,
    checkIfExists,
};
