const util = require('util');
const EventEmitter = require('events');
const natural = require('natural');

const packageJson = require('./../../package.json');

function Ai (os) {

    EventEmitter.call(this);
    var Ai = this;

    this.os = os;
    this.name = process.env.NAME;
    this.status = 'fine';
    this.version = packageJson.version;
    this.setup = packageJson;
    this.defaultUser = null;

    this.tokenizer = new natural.WordTokenizer();

    this.modules = [];

    this.addModule = function (module) {
        this.modules.push(module);
    };

    this.processMessage = function (user, message) {
        if (!user || !message) {
            return;
        }
        var words = this.tokenizer.tokenize(message);

        var commandFound = null;
        var resultFound = null;
        this.modules.every(function (module, index) {
            module.commands.every(function (command, index) {
                var result = command.valid(user, message, words);
                if (result) {
                    commandFound = command;
                    resultFound = result;
                    return false;
                } else {
                    return true;
                }
            });

            if (commandFound) {
                return false;
            } else {
                return true;
            }
        });

        if (commandFound) {
            commandFound.do(user, message, words, resultFound);
        } else {
            Ai.say(user, 'Sorry I didn\'t understand your request.');
        }
    };

    this.hasWord = function (words, index, string) {
        if (words.length > index) {
            return natural.JaroWinklerDistance(words[index], string) > 0.9;
        } else {
            return false;
        }
    };

    this.hasWords = function (words, string) {
        var wordList = string.split(' ');
        if (words.length < wordList.length) {
            return false;
        }

        for(var i = 0 ; i < wordList.length ; i++) {
            if (!this.hasWord(words, i, wordList[i])) {
                return false;
            }
        }
        return true;
    };

    this.say = function (user, message) {
        Ai.emit('say', user, message);
    };

    this.start = function () {

        os.models.User.findAll({
            where: {
                master: true
            }
        }).then((users) => {
            users.forEach(function (user) {
                Ai.say(user, 'I am back online!');
            });
        });
        Ai.emit('ready');

    };
}


util.inherits(Ai, EventEmitter);

module.exports = Ai;
