/*

    Game Tracker Router

*/

const express = require('express');
const log = require('../../__utils__/logger');
const responseObject = require('../../__utils__/responseObject');

const router = express.Router();
const gameTrackersService = require('./gameTrackersService');

// Get game tracker game detail full page
router.get('/detail/game=:gameId', async (req, res) => {
    try {
        const response = await gameTrackersService.getGameTrackerGameDetail(req.params.gameId);
        res.status(200).json(response);
    } catch (e) {
        // Handling your errors
        res.status(500).json(e);
    }
});

// Get stats of a game's teams
router.get('/detail/team_stats/game=:gameId', async (req, res) => {
    // Compare Stats on the Game Detail
    try {
        const feed = await gameTrackersService.gdTeamStatistics(req.params.gameId);
        const response = responseObject(feed, 200);
        res.status(response.status).json(response);
    } catch (e) {
        res.status(409).json({});
    }
});

// Get top scores of a game and its teams win-loss ratio
router.get('/top_scores/game=:gameId', async (req, res) => {
    try {
        const scores = await gameTrackersService.getScoresAndRatio(req.params.gameId);
        const response = responseObject(scores, 200);
        res.status(response.status).json(response);
    } catch (e) {
        res.status(500).json(e);
    }
});

// Get top scores of a game
router.get('/top_scores/scores/game=:gameId', async (req, res) => {
    try {
        const scores = await gameTrackersService.getTopScores(req.params.gameId);
        const response = responseObject(scores, 200);
        res.status(response.status).json(response);
    } catch (e) {
        res.status(500).json(e);
    }
});

// Get win-loss ratio of a team
router.get('/top_scores/win_loss/team=:teamId', async (req, res) => {
    try {
        const ratio = await gameTrackersService.getWLRatio(req.params.teamId);
        const response = responseObject(ratio, 200);
        res.status(response.status).json(response);
    } catch (e) {
        res.status(500).json(e);
    }
});

// Get quarter by quarter info of a game
router.get('/qbq/game=:gameId', async (req, res) => {
    try {
        log.debug(`Request parameters: ${req.params.gameId}`);
        const standings = await gameTrackersService.getQbyQ(req.params.gameId);
        const response = responseObject(standings, 200);
        res.status(response.status).json(response);
    } catch (e) {
        res.status(500).json(e);
    }
});

// Get team leaders of two teams
router.get('/team/leaders/home=:homeTeam&away=:awayTeam', async (req, res) => {
    const { params } = req.params;
    console.log(params);
    const feed = await gameTrackersService.getNbaTeamLeaders(params.homeTeam, params.awayTeam);
    const response = responseObject(feed, 200);
    res.status(response.status).json(response);
});

// Get team stats of two teams
router.get('/team/stats/home=:homeTeam&away=:awayTeam', async (req, res) => {
    const { params } = req.params;
    const feed = await gameTrackersService.compareTeamStatistics(params.homeTeam, params.awayTeam);
    const response = responseObject(feed, 200);
    res.status(response.status).json(response);
});

module.exports = router;
