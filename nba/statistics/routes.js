/*

    Statistics router

*/
const express = require('express');

const router = express.Router();
const nbasvc = require('../nbaService');

const getLastThreeGames = (schedule) => {
    // Finals Stub:
    const lastThreeGames = [];
    const games = schedule.gscd.g;
    for (let i = 0; i < games.length; i += 1) {
        const gdte = games[i].gdte.toString();
        if (gdte === '2018-06-03') {
            lastThreeGames.push(games[i + 2]);
            lastThreeGames.push(games[i + 1]);
            lastThreeGames.push(games[i]);
        }
    }
    return lastThreeGames;
};

const roundStats = (stats) => {
    Object.keys(stats.sta).forEach((key) => {
        if (stats.sta[key].val) {
            if (stats.sta[key].val > 1) {
                // eslint-disable-next-line one-var
                stats.sta[key].val = Math.round(stats.sta[key].val * 10) / 10;
            }
        }
    });
    return stats;
};

router.get('/', async (req, res) => {
    const schedule = await nbasvc.getNbaFeed('teamSchedule', []);
    const stats = await nbasvc.getNbaFeed('teamStats', ['warriors']);
    const feed = {
        header: {
            name: 'Winning Streak',
            value: 24,
        },
        teamStats: await roundStats(stats),
        lastThreeGames: await getLastThreeGames(schedule),
        teamLeaders: await nbasvc.getNbaFeed('teamLeaders', ['warriors']),
    };
    const body = {
        response: feed,
        code: 200,
    };
    res.status(200).json(body);
});

module.exports = router;
