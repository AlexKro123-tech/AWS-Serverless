const {useHooks, logEvent, parseEvent, handleUnexpectedError} = require('lambda-hooks');

//logEvent => console.log(event)
const withHooks = useHooks({
    before: [logEvent, parseEvent],
    after: [],
    onError: [handleUnexpectedError],
});

module.exports = {
    withHooks,
}