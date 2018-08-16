/* eslint-disable */
const nbaService = require('../nbaService');

module.exports = {

    /**
     * Get Standings by Conference
     *
     * Takes the standings feed and returns array of teams of specified conference.
     *
     * @param {string} coVal Conference value. Options are:
     * * `'East'`
     * * `'West'`
     * * `'Internatio'`
     * @param {string} season Season type ID. Options are:
     * * `'01'` for preseason
     * * `'02'` for regular season
     * @returns {object[]} Teams of specified conference. Refer to NBA Mobile Statistical Feed to
     * know the contents of a team object.
     */
    getStaCo: async (coVal, season) => {
        let standings,
            conference,
            division,
            team;

        if (!season) {
            standings = await nbaService.getNbaFeed('standings');
        } else {
            standings = await nbaService.getNbaFeed('standingsSeason', [season]);
        }

        const conferences = standings.sta.co;

        for (conference of conferences) {
            if (conference.val === coVal) {
                let teams = [];
                for (division of conference.di){
                    for (team of division.t) {
                        teams.push(team);
                    }
                }
                return teams;
            }
        }

        const res = {
            error: {
                message: `'${coVal}' is not a valid conference value. Options are 'East', 'West' and 'Internatio'`,
                code: 400,
            },
            statusCode: 400,
        };
        return res;
    },
};
