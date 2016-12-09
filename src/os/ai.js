const util = require('util');
const EventEmitter = require('events');
const natural = require('natural');

const packageJson = require('./../../package.json');

function Ai () {

    EventEmitter.call(this);
    var Ai = this;

    this.name = process.env.NAME;
    this.status = 'fine';
    this.version = packageJson.version;
    this.setup = packageJson;

    this.tokenizer = new natural.WordTokenizer();

    this.commands = [];

    this.addCommand = function (command) {
        this.commands.push(command);
    };

    this.processMessage = function (user, message) {
        if (!user || !message) {
            return;
        }
        var words = this.tokenizer.tokenize(message);

        var commandFound = null;
        this.commands.every(function (command, index) {
            if (command.valid(user, message, words)) {
                commandFound = command;
                return false;
            } else {
                return true;
            }
        });

        if (commandFound) {
            commandFound.do();
        } else {
            Ai.say(user, 'Sorry I didn\'t understand your request.');
        }

        /*
        if (Ai.hasWords(words, Ai.name)) {
            Ai.say(user, 'Yes?');
        } else if (Ai.hasWords(words, 'help')) {
            Ai.say(user, 'I am here to assist you in your recurrent tasks. If you forget something I will remind you.');
        } else if (Ai.hasWords(words, 'version')) {
            Ai.say(user, 'My version is '+Ai.setup.version+'.');
        } else if (Ai.hasWords(words, 'name')) {
            Ai.say(user, 'My name is '+Ai.name+'.');
        } else if (Ai.hasWords(words, 'how are you')) {
            Ai.say(user, 'I am '+Ai.status+'. Thanks for asking. And you?');
        } else {
        }*/
    };

    this.hasWord = function (words, index, string) {
        if (words[index]) {
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
}


util.inherits(Ai, EventEmitter);

module.exports = Ai;
