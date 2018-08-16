/*

    Game Trackers Service Layer

*/

const nbaService = require('../nbaService');

/**
 * Get Win-Loss Ratio
 * --
 * Gets the updated scores of home and visitor teams of a specific game.
 * @param {string} game Game ID
 * @returns {object} On a success, returns home and visitor teams' scores.
 */
const getWLRatio = async (ta) => {
    const feed = await nbaService.getNbaFeed('standingsSeason', ['02']);
    const conferences = feed.sta.co;
    let divisions = conferences.di,
        teams,
        result,
        res;

    // For every division in every conference, look for specified team.
    // eslint-disable-next-line one-var
    conferences.forEach((conference) => {
        divisions = conference.di;
        divisions.forEach((division) => {
            teams = division.t;
            if (!result) {
                result = teams.find(team => team.ta === ta);
            }
        });
    });

    // If we found a team, we respond with it's wins and it's losses.
    if (result) {
        res = {
            response: {
                wins: result.w,
                losses: result.l,
            },
            statusCode: 200,
        };
        return res;
    }

    // If we didn't found a team, we respond with an error.
    res = {
        error: {
            message: `There is no team with abbreviation '${ta}'. Look in nba/__config__/nbaTEamsAbbreviations for supported abbreviations`, // eslint-disable-line max-len
            code: 404,
        },
        statusCode: 404,
    };
    return res;
};

/**
 * Get Top Scores
 * --
 * Gets the updated scores of home and visitor teams of a specific game.
 * @param {string} gameId ID of game in question.
 * @returns {object} On a success, returns home and visitor's data (team abbreviation and
 * score).
 */
const getTopScores = async (gameId) => {
    const feed = await nbaService.getNbaFeed('detail', [gameId]);
    const game = feed.g;
    const play = game.lpla;
    let res;

    // If we don't get any feed as response, it's because there's no game with that ID.
    if (feed === undefined) {
        res = {
            error: {
                message: `Game with ID ${gameId} not found.`,
                code: 404,
            },
            statusCode: 404,
        };
        return res;
    }

    // If we do, we return an object with both scores.
    console.log(game);
    res = {
        response: {
            home: {
                team: game.hls.ta,
                score: play.hs,
            },
            visitor: {
                team: game.vls.ta,
                score: play.vs,
            },
        },
        statusCode: 200,
    };
    return res;
};

/**
     * Get Top Scores and Win-Loss Ratio
     * --
     * Gets the updated scores and win-loss ratios of home and visitor teams of a specific game.
     * @param {string} gameId ID of game in question.
     * @returns {object} On a success, returns home and visitor's data (team abbreviation, score,
     * wins, and losses).
     */
const getScoresAndRatio = async (gameId) => {
    const scores = await getTopScores(gameId);
    const { home, visitor } = scores.response;
    const homeRatio = await getWLRatio(home.team);
    const visitorRatio = await getWLRatio(visitor.team);
    let res;

    if (scores) {
        res = {
            response: {
                home: {
                    team: home.team,
                    score: home.score,
                    wins: homeRatio.response.wins,
                    losses: homeRatio.response.losses,
                },
                visitor: {
                    team: visitor.team,
                    score: visitor.score,
                    wins: visitorRatio.response.wins,
                    losses: visitorRatio.response.losses,
                },
            },
            statusCode: 200,
        };
        return res;
    }

    res = {
        error: {
            message: `Game with ID ${gameId} not found.`,
            code: 404,
        },
        statusCode: 404,
    };
    return res;
};

const getQbyQ = async (gameId) => {
    const gameDetails = await nbaService.getNbaFeed('detail', [gameId]);
    const res = {
        hls: {
            q1: gameDetails.g.hls.q1,
            q2: gameDetails.g.hls.q2,
            q3: gameDetails.g.hls.q3,
            q4: gameDetails.g.hls.q4,
            s: gameDetails.g.hls.s,
            ot1: gameDetails.g.hls.ot1,
            ot2: gameDetails.g.hls.ot2,
            ot3: gameDetails.g.hls.ot3,
        },
        vls: {
            q1: gameDetails.g.vls.q1,
            q2: gameDetails.g.vls.q2,
            q3: gameDetails.g.vls.q3,
            q4: gameDetails.g.vls.q4,
            s: gameDetails.g.vls.s,
            ot1: gameDetails.g.vls.ot1,
            ot2: gameDetails.g.vls.ot2,
            ot3: gameDetails.g.vls.ot3,
        },
    };
    return res;
};

const getNbaTeamLeaders = async (homeTeam, awayTeam) => {
    const home = await nbaService.getNbaFeed('teamLeaders', [homeTeam.toString()]);
    const away = await nbaService.getNbaFeed('teamLeaders', [awayTeam.toString()]);
    const feed = { homeTeamLeaders: home, awayTeamLeaders: away };

    return feed;
};
const compareTeamStatistics = async (homeTeam, awayTeam) => {
    const home = await nbaService.getNbaFeed('teamStats', [homeTeam.toString()]);
    const away = await nbaService.getNbaFeed('teamStats', [awayTeam.toString()]);
    const feed = { homeTeamStats: home, awayTeamStats: away };

    return feed;
};
const gdTeamStatistics = async (gameID) => {
    // Stats for the Game Detail Page
    const gameStats = await nbaService.getNbaFeed('detail', [gameID]);
    const feed = { homeTeamStats: gameStats.g.hls, awayTeamStats: gameStats.g.vls };
    return feed;
};

const appendGameDetailModules = async (id) => {
    const arr = [];
    arr.push({ id: 'topScore', data: await getTopScores(id) });
    arr.push({ id: 'scoreAndRatio', data: await getScoresAndRatio(id) });
    arr.push({ id: 'quarterByQuarterScore', data: await getQbyQ(id) });
    arr.push({ id: 'compareTeamStats', data: await gdTeamStatistics(id) });
    return arr;
};

const getGameTrackerGameDetail = async (gameID) => {
    // Stats for the Game Detail Page
    const obj = { // (Object) Feed
        id: 'nbaGameTracker',
        modules: await appendGameDetailModules(gameID),
    };
    console.log(obj);
    return obj;
};

module.exports = {
    getWLRatio,
    getTopScores,
    getScoresAndRatio,
    getQbyQ,
    getNbaTeamLeaders,
    compareTeamStatistics,
    gdTeamStatistics,
    getGameTrackerGameDetail,
};
