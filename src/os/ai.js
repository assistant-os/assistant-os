const util = require('util');
const EventEmitter = require('events');
const natural = require('natural');

function Ai () {

    EventEmitter.call(this);
    var Ai = this;

    this.name = process.env.NAME;
    this.status = 'fine';

    this.tokenizer = new natural.WordTokenizer();

    this.processMessage = function (user, message) {
        if (!user || !message) {
            return;
        }
        var words = this.tokenizer.tokenize(message);

        if (Ai.hasWords(words, Ai.name)) {
            Ai.say(user, 'Yes?');
        } else if (Ai.hasWords(words, 'help')) {
            Ai.say(user, 'I am here to assist you in your recurrent tasks. If you forget something I will remind you.');
        } else if (Ai.hasWords(words, 'how are you')) {
            Ai.say(user, 'I am '+Ai.status+'. Thanks for asking. And you?');
        } else {
            Ai.say(user, 'Sorry I didn\'t understand your request.');
        }
    };

    this.hasWord = function (words, index, string) {
        if (words[index]) {
            return natural.JaroWinklerDistance(words[index], string) > 0.8;
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
