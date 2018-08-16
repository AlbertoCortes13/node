/*

    Standings router

*/
const express = require('express'),
    router = express.Router(),
    standingsService = require('./standingsService');

// Get all standings
router.get('/', async (req, res) => {
    try {
        const east = await standingsService.getStaCo('East'),
            west = await standingsService.getStaCo('West');
        res.status(200).json({ west, east });
    } catch (e) {
        res.status(500).json(e);
    }
});

// Get standings by conference
router.get('/conference=:confName&season=:seasonId', async (req, res) => {
    try {
        let conference;
        if (req.params.season === '00') {
            conference = await standingsService.getStaCo(req.params.co);
        } else {
            conference = await standingsService.getStaCo(req.params.co, [req.params.season]);
        }

        res.status(200).json(conference);
    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = router;
