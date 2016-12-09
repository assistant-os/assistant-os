const introduction = require('./introduction');
const lang = require('./lang');

module.exports = function (ai) {
    introduction(ai);
    lang(ai);
};
