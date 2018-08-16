// cache control value
const log = require('../../__utils__/logger');

const ccv = '10s';
// season year
const year = '2017';
// year = '2017', // getYear

const endpoints = {
    // Live feeds
    todaysScores: 'scores/00_todays_scores',
    full: 'scores/pbp/<params[0]>_<params[1]>_pbp.json',
    abbreviated: 'scores/spbp/<params[0]>_spbp.json',
    detail: 'scores/gamedetail/<params[0]>_gamedetail.json',

    // League files
    standings: '00_standings.json',
    teamStats: 'teams/statistics/<params[0]>/teamstats_02.json',
    standingsSeason: '00_standings_<params[0]>.json',
    playoff: 'scores/00_playoff_bracket.json',
    team: 'teams/00_team_info.json',
    playerInfo: 'players/00_player_info.json',
    allTimeLeaders: 'league/stats/00_alltime_leaders_<params[0]>_<params[1]>.json',
    allTimePlayers: 'league/stats/00_historical_players.json',
    leader: 'league/stats/00_league_leaders_<params[0]>.json',
    leaderCategory: 'league/stats/00_league_leaders_<params[0]>_<params[1]>.json',

    // Schedule feeds
    teamSchedule: 'teams/warriors_schedule.json',
    // teamSchedule: '/league/00_rolling_schedule.json',

    // Team feeds
    teamLeaders: 'teams/statistics/<params[0]>/leaders_02.json',
    // TODO: implement the rest of the endpoints.
};

module.exports = {
    baseUrl: `http://data.nba.com/data/${ccv}/v2015/json/mobile_teams/nba/${year}/`,

    /**
     * Get NBA Endpoint
     * ---
     * Retrieve endpoint required for NBA API.
     * @param {string} type Type of feed. Options are:
     *
     * @param {Object[]} params The parameters needed for the endpoint. Pass the parameters as
     * strings in the order in which they're described above.
     *
     * @returns {string} The endpoint with it's appropriate parameters.
     */
    getNbaEndpoint: async (type, params) => {
        let result;
        let i = 0;
        if (!params) {
            result = endpoints[type];
        } else {
            let workingEndpoint = endpoints[type];
            for (; i < params.length; i += 1) {
                log.debug(params.length);
                workingEndpoint = workingEndpoint.replace(`<params[${i}]>`, params[i]);
            }
            result = workingEndpoint;
        }
        log.verbose(`NBA Working endpoint: ${result}`);
        return result;
    },
};
