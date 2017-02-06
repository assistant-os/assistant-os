// const franc = require('franc');
const LanguageDetect = require('languagedetect');

function BadLanguage (ai) {

    this.ai = ai;
    this.id = 'bad-language';
    this.lngDetector = new LanguageDetect();

    this.valid = function (user, message, words) {

        if (words.length < 3) {
            return false;
        }

        var langs = this.lngDetector.detect(message);
        // console.log(langs);
        for (var i = 0 ; i < langs.length ; i++) {
            if (langs[i][0] == 'english' && langs[i][1] > 0.3) {
                return false;
            }
        }

        // this.languageDetected = langs[0][0];
        return true;
    };

    this.do = function (user, message, words) {
        if (this.valid(user, message, words)) {
            this.ai.say(user, 'Sorry I only speak english.');
        }
    };
}

module.exports = function (ai) {
    return [
        new BadLanguage(ai)
    ];
};
