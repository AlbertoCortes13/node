const log = require('./logger');

module.exports = function ResponseObject(data, status) {
    const obj = {};
    log.verbose('Creating Response Object');
    if (status === 200) {
        if (data instanceof String) {
            obj.response = { error: data, message: data };
        } else {
            obj.response = data;
        }
        obj.status = status;
        return obj;
    }
    obj.error = {};
    obj.error.message = data;
    obj.status = status;
    return obj;
};
