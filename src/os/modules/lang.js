// const franc = require('franc');
const LanguageDetect = require('languagedetect');

function BadLanguage (ai) {

    this.ai = ai;
    this.id = 'bad-language';
    this.user = null;
    this.lngDetector = new LanguageDetect();
    this.languageDetected = null;

    this.valid = function (user, message, words) {

        if (words.length < 3) {
            return false;
        }

        // console.log('this.valid lang');
        this.languageDetected = null;
        var langs = this.lngDetector.detect(message);
        console.log('language', langs);
        for (var i = 0 ; i < langs.length ; i++) {
            if (langs[i][0] == 'english' && langs[i][1] > 0.3) {
                // console.log('english');
                return false;
            }
        }

        this.user = user;
        this.languageDetected = langs[0][0];
        // console.log(this.languageDetected);

        return true;
    };

    this.do = function () {
        console
        if (this.user && this.languageDetected) {
            this.ai.say(this.user, 'Sorry I don\'t speak '+this.languageDetected+'. I only speak english.');
        }
        this.user = null;
        this.languageDetected = null;
    };
}

module.exports = function (ai) {
    return [
        new BadLanguage(ai)
    ];
};
