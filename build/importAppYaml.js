const fs = require('fs');
const https = require('https');

const basePrefix = 'https://storage.googleapis.com/admin-asset-keys/';

const appYamlFileName = 'app.yaml';

const appYamlFileStream = fs.createWriteStream(`./${appYamlFileName}`);

// Get app.yaml for deployment
https.get(`${basePrefix}${appYamlFileName}`, (response) => {
    response.pipe(appYamlFileStream);
});
