const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');

const tableName = process.env.tableName;

exports.handler = async event => {
    console.log('event', event);

    let ID = event.pathParameters.ID;
    const score = JSON.parse(event.body);
    // dynamicly obtain field name and value from request body
    // NOTE: Name and name are reserved and DB field name is case sensitive
    const res = await Dynamo.update({
        tableName,
        primaryKey: 'ID',
        primaryKeyValue: ID,
        updateKey: Object.getOwnPropertyNames(score)[0],
        updateValue: Object.values(score)[0],
    })
    return Responses._200({

    });
};