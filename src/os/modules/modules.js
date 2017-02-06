function List (ai) {

    this.ai = ai;
    this.id = 'list-modules';

    this.valid = function (user, message, words) {
        if (this.ai.hasWords(words, 'list modules')){
            return true;
        } else {
            return false;
        }
    };

    this.do = function (user, message, words) {
        if (this.valid(user, message, words)) {
            var modules = [];
            this.ai.modules.forEach(function (module) {
                modules.push(module.id);
            });
            this.ai.say(user, 'The current modules are: '+modules.join(', '));
        }
    };
}

function ListCommands (ai) {

    this.ai = ai;
    this.id = 'list-commands';

    this.valid = function (user, message, words) {
        if (this.ai.hasWords(words, 'list commands in')){

            console.log('list commands');
            for(var i = 0 ; i < this.ai.modules.length ; i++) {
                if (this.ai.hasWord(words, 3, this.ai.modules[i].id)) {
                    // this.module = this.ai.modules[i];
                    // this.user = user;
                    // console.log(this.module.id);
                    return { module: this.ai.modules[i] };
                }
            }

            //this.ai.say(user, 'In order to have the list of commands use: list commands in <module-id>')
            return false;
        } else {
            return false;
        }
    };

    this.do = function (user, message, words) {
        var valid = this.valid(user, message, words);
        if (valid) {
            // console.log('do');
            var commands = [];
            valid.module.commands.forEach(function (command) {
                commands.push(command.id);
            });
            this.ai.say(user, 'The current modules are: '+commands.join(', '));
        }

    };
}
/*
function HelpModule (ai) {

    this.ai = ai;
    this.id = 'help-module';
    this.user = null;
    this.module = null;

    this.valid = function (user, message, words) {
        if (this.ai.hasWords(words, 'help')){

            console.log('list commands');
            for(var i = 0 ; i < this.ai.modules.length ; i++) {
                if (this.ai.hasWord(words, 3, this.ai.modules[i].id)) {
                    this.module = this.ai.modules[i];
                    this.user = user;
                    console.log(this.module.id);
                    return true;
                }
            }

            //this.ai.say(user, 'In order to have the list of commands use: list commands in <module-id>')
            return false;
        } else {
            return false;
        }
    };

    this.do = function () {
        if (this.user && this.module) {
            console.log('do');
            var commands = [];
            this.module.commands.forEach(function (command) {
                commands.push(command.id);
            });
            this.ai.say(this.user, 'The current modules are: '+commands.join(', '));
        }
        this.user = null;
        this.module = null;
    };
}*/

module.exports = function (ai) {
    return [
        new List(ai),
        new ListCommands(ai)
    ];
};
