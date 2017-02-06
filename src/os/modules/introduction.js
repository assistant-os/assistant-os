const ns = require('natural-script');

function Hello (ai) {

    this.ai = ai;
    this.id = 'hello';

    this.valid = function (user, message, words) {
        return ns.parse(message, 'hello')
        || ns.parse(message, 'hi')
        || ns.parse(message, 'good afternon')
        || ns.parse(message, 'good morning');
    };

    this.do = function (user, message, words, result) {
        this.ai.say(user, 'Hello!');
    };
}

function Yes (ai) {

    this.ai = ai;
    this.id = 'yes';

    this.valid = function (user, message, words) {
        if (this.ai.hasWords(words, ai.name)){
            return true;
        } else {
            return false;
        }
    };

    this.do = function (user, message, words) {
        if (this.valid(user, message, words)) {
            this.ai.say(user, 'Yes?');
        }
    };
}

function Name (ai) {
    this.ai = ai;
    this.id = 'name';

    this.valid = function (user, message, words) {
        return ns.parse(message, 'name')
        || ns.parse(message, 'what is your name') 
        if (this.ai.hasWords(words, 'name')){
            return true;
        } else {
            return false;
        }
    };

    this.do = function (user, message, words) {
        if (this.valid(user, message, words)) {
            this.ai.say(user, 'My name is '+ai.name+'.');
        }
    };
}

function Version (ai) {
    this.ai = ai;
    this.id = 'version';

    this.valid = function (user, message, words) {
        if (this.ai.hasWords(words, 'version')){
            return true;
        } else {
            return false;
        }
    };

    this.do = function (user, message, words) {
        if (this.valid(user, message, words)) {
            this.ai.say(user, 'My version is '+ai.version+' but I am already fully operationnal.');
        }
    };
}

function Help (ai) {
    this.ai = ai;
    this.id = 'version';

    this.valid = function (user, message, words) {
        if (this.ai.hasWords(words, 'help') && words.length == 1){
            return true;
        } else {
            return false;
        }
    };

    this.do = function (user, message, words) {
        if (this.valid(user, message, words)) {
            this.ai.say(user, 'I am here to assist you in your recurrent tasks. If you forget something I will remind you.'); // For more help, use `help module <module-id>`, `help command <command-id>`'
        }
    };
}


module.exports = function (ai) {
    return [
        new Hello(ai),
        new Yes(ai),
        new Name(ai),
        new Version(ai),
        new Help(ai)
    ];
};
