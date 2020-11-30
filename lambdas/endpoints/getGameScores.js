const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const yup = require('yup');

const { hookPathValidation } = require('../common/hooks');

const tableName = process.env.tableName;
// DunamoDB table Global Secondary Index to get all players by game id
const gameGSI = process.env.gameGSI;

// defines what attributes required inside event.pathParameters
const pathSchema = yup.object().shape({
    game: yup.string().required(),
});

const handler = async event => {

    const game = event.pathParameters.game;

    const gamePlayers = await Dynamo.query({
        tableName,
        index: gameGSI,
        queryKey: 'game',
        queryValue: game,
    });

    return Responses._200(gamePlayers);
};

exports.handler = hookPathValidation({pathSchema})(handler);