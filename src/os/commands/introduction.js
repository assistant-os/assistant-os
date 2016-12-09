function Yes (ai) {

    this.ai = ai;
    this.id = 'yes';
    this.user = null;

    this.valid = function (user, message, words) {
        if (this.ai.hasWords(words, ai.name)){
            this.user = user;
            return true;
        } else {
            return false;
        }
    };

    this.do = function () {
        if (this.user) {
            this.ai.say(this.user, 'Yes?');
        }
        this.user = null;
    };
}

function Name (ai) {
    this.ai = ai;
    this.id = 'name';
    this.user = null;

    this.valid = function (user, message, words) {
        if (this.ai.hasWords(words, 'name')){
            this.user = user;
            return true;
        } else {
            return false;
        }
    };

    this.do = function () {
        if (this.user) {
            this.ai.say(this.user, 'My name is '+ai.name+'.');
        }
        this.user = null;
    };
}

function Version (ai) {
    this.ai = ai;
    this.id = 'version';
    this.user = null;

    this.valid = function (user, message, words) {
        if (this.ai.hasWords(words, 'version')){
            this.user = user;
            return true;
        } else {
            return false;
        }
    };

    this.do = function () {
        if (this.user) {
            this.ai.say(this.user, 'My version is '+ai.version+' but I am already fully operationnal.');
        }
        this.user = null;
    };
}

function Help (ai) {
    this.ai = ai;
    this.id = 'version';
    this.user = null;

    this.valid = function (user, message, words) {
        if (this.ai.hasWords(words, 'help')){
            this.user = user;
            return true;
        } else {
            return false;
        }
    };

    this.do = function () {
        if (this.user) {
            this.ai.say(this.user, 'I am here to assist you in your recurrent tasks. If you forget something I will remind you.');
        }
        this.user = null;
    };
}


module.exports = function (ai) {

    [
        new Yes(ai),
        new Name(ai),
        new Version(ai),
        new Help(ai)
    ].forEach(function (command) {
        ai.addCommand(command);
    });
};
