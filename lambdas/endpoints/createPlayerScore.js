const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const {withHooks} = require('../common/hooks');

const tableName = process.env.tableName;

const handler = async event => {
    
    // Not need to check !event.pathParameters because of parseEvent hook
    if (!event.pathParameters.ID) {
        // failed without an ID
        return Responses._400({
            message: 'missing the ID from the path'
        });
    }

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

exports.handler = withHooks(handler);