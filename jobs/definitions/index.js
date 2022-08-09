const { dataRetentionDefinitions } = require("./dataRetention");

const definitions = [dataRetentionDefinitions];

const allDefinitions = (agenda) => {
    definitions.forEach((definition) => definition(agenda));
};

module.exports = { allDefinitions }