const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const yup = require('yup');

const { hookQueryParamsAndPathValidation } = require('../common/hooks');

const tableName = process.env.tableName;

// defines what attributes required inside event.pathParameters
const pathSchema = yup.object().shape({
    playerID: yup.string().required(),
});

// defines optional query parameter
// if defined, it should be number
const queryParamsSchema = yup.object().shape({
    minScore: yup.lazy(value => {
        if (value !== undefined) {
          return yup.object().shape({
            minScore: yup.number().required(),
          });
        }
        return yup.mixed().notRequired();
      }),
});


const handler = async event => {
    
    const playerID = event.pathParameters.playerID;

    let filterExpression = `playerID = :playerID`;
    let expressionAttributes = {
        ':playerID': playerID,
    };

    if (event.queryStringParameters.minScore) {
        const minScore = event.queryStringParameters.minScore;
        filterExpression = `playerID = :playerID and Score >= :minScore`;
        expressionAttributes = {
            ':playerID': playerID,
            ':minScore': Number(minScore),
        };
    }

    const games = await Dynamo.scan({
        tableName,
        filterExpression,
        expressionAttributes,
    });

    return Responses._200(games);
};

exports.handler = hookQueryParamsAndPathValidation({queryParamsSchema, pathSchema})(handler);