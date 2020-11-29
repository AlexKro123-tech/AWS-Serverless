const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const {withHooks, hooksWithValidation} = require('../common/hooks');
const yup = require('yup');

const tableName = process.env.tableName;

// defines what attributes required inside event.body
const bodySchema = yup.object().shape({
    name: yup.string().required(),
    score: yup.number().required(),
});

// defines what attributes required inside event.pathParameters
const pathSchema = yup.object().shape({
    ID: yup.string().required(),
});

const handler = async event => {
    
    // Not need to check !event.pathParameters because of parseEvent hook
    // The whole check is not needed because bodySchema hook
    // if (!event.pathParameters.ID) {
    //     return Responses._400({
    //         message: 'missing the ID from the path'
    //     });
    // }

    let ID = event.pathParameters.ID;
    //const user = JSON.parse(event.body);
    // because of parseEvent hook
    const user = event.body;
    user.ID = ID;

    // const newUser = await Dynamo.write(user, tableName).catch(err => {
    //     console.log('error in dynamo write', err);
    //     return null;
    // });
    // because of handleUnexpectedError hook which will return 400
    // in case of Dynamo function failure
    const newUser = await Dynamo.write(user, tableName);

    if (!newUser) {
        return Responses._400({
            message: `Failed to write user by ID ${ID}`
        });
    }

    return Responses._200({
        newUser
    });
};

exports.handler = hooksWithValidation({bodySchema, pathSchema})(handler);