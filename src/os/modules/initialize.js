const User = require('../models/user');

function Initialize (ai) {
    this.ai = ai;
    this.id = 'version';

    this.valid = function (user, message, words) {
        if (message === 'initialize'){
            return true;
        } else {
            return false;
        }
    };

    this.do = function (user, message, words) {
        // User
        // .sync({force: true});

        user.master = true;
        user.save();
        ai.say(user, "Initialization done.");
    };
}


module.exports = function (ai) {
    return [
        new Initialize(ai)
    ];
};
