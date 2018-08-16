const express = require('express');
const homepageSvc = require('./homepageService');
const log = require('../__utils__/logger');


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await homepageSvc.getHomeFeed();
        res.status(response.status).json(response);
    } catch (e) {
        log.error(e.stack);
        res.status(500).json({ error: e.message, status: 500 });
    }
});

module.exports = router;
