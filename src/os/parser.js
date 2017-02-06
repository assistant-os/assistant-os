const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const MAX_DISTANCE = 0.9;
const chrono = require('chrono-node');
// return natural.JaroWinklerDistance(words[index], string) > 0.9;



function concat(block1, block2) {
    if (block2 === false) {
        return false;
    } else if (block2 === true) {
        return block1;
    } else if (block1 === true) {
        return block2;
    } else if (block1 === false) {
        return false;
    } else if (typeof block2 === 'object') {
        var result = {};
        for (var key in block1) {
            result[key] = block1[key];
        }

        for (var key in block2) {
            result[key] = block2[key];
        }

        return result;
    }
}

var format = {
    date: function (sentence, varName) {
        var results = chrono.parse(sentence);
        // console.log(results);
        if (results.length > 0) {
            if (sentence.indexOf(results[0].text) == 0) {

                var result = {
                    left: sentence.replace(results[0].text, ''),
                    vars: {}
                };

                if (varName) {
                    result.vars[varName] = results[0];
                }
                return result;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};



/*
function parseWords(words) {

}*/

function parse(sentence, expression) {
    var result = parseAux(sentence, expression);
    console.log(result);

    if (typeof result == 'object' && Object.keys(result).length === 0 && result.constructor === Object) {
        return true;
    } else {
        return result;
    }
}

function parseAux(sentence, expression) {
    // console.log('parse', '"'+sentence+'"', '"'+expression+'"');

    var formatRegex = /^(?:\[[ ]*([a-z\_]+[ ]*(?:\:[ ]*[a-z\_]+){0,1})[ ]*\])/;
    var words = tokenizer.tokenize(sentence);
    if (sentence.match(/^[ ]+/)) {
        return parseAux(sentence.replace(/^[ ]+/, ''), expression);
    } else if (expression.match(/^[ ]+/)) {
        return parseAux(sentence, expression.replace(/^[ ]+/, ''));
    } else if (words.length == 0) {
        // console.log('length 0/0');
        if (expression.match(/^[ ]*$/)) {
            return true;
        } else {
            return false;
        }
    } else if (expression == '') {
        // console.log('length 0/1', expression, sentence);

        // end
        if (sentence == '') {
            return true;
        } else {
            return false;
        }
    } else if (expression.match(/^[a-z]+/)) {
        // simple word found
        var referenceWord = expression.match(/^[a-z]+/)[0];
        var realWord = words[0];
        if (natural.JaroWinklerDistance(realWord, referenceWord) > MAX_DISTANCE) {
            return parseAux(sentence.replace(realWord, ''), expression.replace(referenceWord, ''));
        } else {
            return false;
        }
    } else if (expression.match(formatRegex)) {
        console.log(expression.match(formatRegex));
        var currentFormat = expression.match(formatRegex)[1];
        var varType = '';
        var varName = null;
        if (currentFormat.match(/[a-z\_]+\:[a-z\_]+/)) {
            var split = currentFormat.replace(' ', '').split(':');
            varType = split[0];
            varName = split[1];
        } else {
            varType = currentFormat;
        }

        if (format[varType]) {
            var result = format[varType](sentence, varName);
            if (result) {
                var newSentence = result.left;
                var result = parseAux(newSentence, expression.replace(formatRegex, ''));
                console.log(result)
                return concat(result.vars, result);
            } else {
                return false;
            }
        } else {
            throw 'format "'+varType+'" is not managed';
        }

    }
}

module.exports.parse = parse;
module.exports.format = format;
