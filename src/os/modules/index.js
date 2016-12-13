const packageJson = require('./../../../package.json');

const introduction = require('./introduction');
const lang = require('./lang');
const modules = require('./modules');


module.exports = function (ai) {
    ai.addModule({
        id: packageJson.name,
        commands: [].concat(introduction(ai))/*.concat(lang(ai))*/.concat(modules(ai))
    });
};
