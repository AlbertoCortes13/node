const nbaStandings = require('../nba/standings/standingsService');
const nbasvc = require('../nba/nbaService');
const responseObject = require('../__utils__/responseObject');


const getWesternStandings = async () => {
    const west = await nbaStandings.getStandings('West');
    return west.response;
};

const getStatistics = async () => {
    const stats = await nbasvc.getNbaFeed('teamStats', ['warriors']);
    Object.keys(stats.sta).forEach((key) => {
        if (stats.sta[key].val) {
            if (stats.sta[key].val > 1) {
                stats.sta[key].val = Math.round(stats.sta[key].val * 10) / 10;
            }
        }
    });
    return stats;
};

const getPlayerStats = async () => {
    const playerStats = {};
    return playerStats;
};

const getHomeFeed = async () => {
    try {
        let feed = [];
        const westernStandings = await getWesternStandings();
        const teamStats = await getStatistics();
        const playerStats = await getPlayerStats();

        // TODO: These Home Feed items
        feed.push({ id: 'liveEvents', data: [] });
        feed.push({ id: 'videoContent', data: [] });
        feed.push({ id: 'articles', data: [] });
        feed.push({ id: 'playerSpotlight', data: {} });
        feed.push({ id: 'playerStats', data: playerStats });
        feed.push({ id: 'teamStats', data: teamStats });
        feed.push({ id: 'westernStandings', data: westernStandings });
        feed.push({ id: 'carousels', data: [] });
        feed.push({ id: 'nextEvents', data: [] });
        feed = responseObject(feed, 200);
        return feed;
    } catch (e) {
        return responseObject(e, 500);
    }
};

module.exports = {
    getWesternStandings,
    getHomeFeed,
    getStatistics,
    getPlayerStats,
};
