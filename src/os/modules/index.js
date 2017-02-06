const packageJson = require('./../../../package.json');

module.exports = function (ai) {

    ai.addModule({
        id: packageJson.name,
        commands: []
            .concat(require('./initialize')(ai))
            .concat(require('./introduction')(ai))
            .concat(require('./reminder')(ai))
            .concat(require('./wake-up')(ai))
            .concat(require('./modules')(ai))
            // .concat(require('./lang')(ai))
    });
};
