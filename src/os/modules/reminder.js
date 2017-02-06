const ns = require('natural-script');
const later = require('later');

const User = require('../models/user');
const Reminder = require('../models/reminder');

function ListReminders (ai) {

    this.ai = ai;
    this.id = 'list-reminders';

    this.valid = function (user, message) {
        return ns.parse(message, 'list reminders');
    };

    this.do = function (user) {

        Reminder.findAll({
            attributes: ['id', 'type', 'subtype', 'content', 'date'],
            where: {
                finished: 'false',
                userId: user.id
            }
        }).then((reminders) => {
            // console.log(reminders);
            let s = '';
            for(var i = 0 ; i < reminders.length ; i++) {
                let reminder = reminders[i];
                s += '\n';
                s += '\tid: '+reminder.id+'\n';
                s += '\ttype: '+reminder.type+'\n';
                s += '\tsubtype: '+reminder.subtype+'\n';
                s += '\tcontent: '+reminder.content+'\n';
                s += '\tdate: '+reminder.date+'\n';
                // s += JSON.stringify({
                //     type: reminders[i].type,
                //     subtype: reminders[i].subtype,
                //     content: reminders[i].content,
                //     date: reminders[i].date
                // }) + '\n';
            }

            if (s === '') {
                s = 'no reminders found';
            }

            ai.say(user, 'reminders: '+s);
        });
    };
}

function CancelReminder (ai) {

    this.ai = ai;
    this.id = 'cancel-reminder';

    this.valid = function (user, message) {
        return ns.parse(message, 'cancel reminder {{integer:id}}') /*|| ns.parse(message, 'cancel all reminders {{integer:id}}')*/;
    };

    this.do = function (user, message, words, result) {
        // ai.say(user, 'reminder '+result.id.integer);
        Reminder.update({
            finished: 'canceled',
            userId: user.id
        }, {
            where: {
                id: result.id.integer
            }
        }).then((reminder) => {
            // ai.say(user, 'updated');
        });
    };
}

module.exports = function (ai) {

    return [
        new CancelReminder(ai),
        new ListReminders(ai)
    ];
};
