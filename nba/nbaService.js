/*

    NBA Service Layer

*/

const request = require('request'),
    nbaEndpoints = require('./__config__/endpoints');

module.exports = {

    /**
     * Get NBA Feed
     * ---
     * Returns an object from the type of feed requested.
     *
     * @param {string} type Type of feed. Options are:
     *
     * Live feeds
     * * __'todaysScores'__
     * * __'full'__ for Full Game Play by Play. Requires _game ID_ and _quarter_.
     * * __'abbreviated'__ for Abbreviated Game Play by Play. Requires _game ID_.
     * * __'detail'__ for Game Detail
     *
     * NBA files
     * * __'standings'__. Only when not requesting standings by season.
     * * __'standingsSeason'__ For requesting standings by season. Requires _season type ID_.
     * * __'playoff'__ for Playoff Bracket.
     * * __'team'__ for Team Info.
     * * __'playerInfo'__.
     * * __'allTimeLeaders'__. Requires _stat type_ and _season type ID_.
     * * __'allTimePlayers'__.
     * * __'leader'__ for Top 1 player. Requires _season type ID_.
     * * __'leaderCategory'__ for Leader by individual category. Requires _stat type_ and
     * _season type ID_.
     * @todo document supported types and their required params.
     *
     * @param {object} params The parameters needed for the type of feed requested.
     * @returns {Promise} Requested feed. Refer to _NBA Mobile Statistical Feed_ to know the
     * properties of the object.
     */
    getNbaFeed: async (type, params) => {
        const uri = nbaEndpoints.baseUrl + await nbaEndpoints.getNbaEndpoint(type, params),
            promise = new Promise((resolve, reject) => {
                request(uri, { json: true }, (err, res, body) => {
                    if (err) {
                        reject(err);
                        // return console.log(err);
                    }

                    resolve(body);
                });
            });

        let feed = await promise;
        console.log(feed);
        feed = JSON.stringify(feed);
        feed = feed.replace('\n', ' ');
        /* eslint-disable no-undef */
        result = JSON.parse(feed);
        return result;
    },

};
