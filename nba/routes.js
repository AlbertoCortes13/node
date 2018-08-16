const express = require('express');

const router = express.Router();

// Module routes
const gameTrackersRoutes = require('./game_trackers/routes');
const playersRoutes = require('./players/routes');
const scheduleRoutes = require('./schedule/routes');
const standingsRoutes = require('./standings/routes');
const statisticsRoutes = require('./statistics/routes');
const videoRoutes = require('./video/routes');

/* Router URL Imports */

router.use((req, res, next) => {
    // do logging
    console.log(`Running ${req.method} at /nba${req.url}`);
    next(); // make sure we go to the next routes and don't stop here
});

router.use('/game_trackers', gameTrackersRoutes);
router.use('/players', playersRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/standings', standingsRoutes);
router.use('/stats', statisticsRoutes);
router.use('/video', videoRoutes);

module.exports = router;
