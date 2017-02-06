const ns = require('natural-script');
const later = require('later');

const Reminder = require('../models/reminder');

const snoozeTimeout = 30 * 1000;

let timeouts = {};

function scheduleDateReminder (ai, reminder) {
    let diff = new Date(reminder.date) - new Date();

    if (diff <= 0) {
        reminder.finished = 'passed';
        reminder.save();
    }

    let timeout = setTimeout(() => {

        reminder.reload().then( () => {
            if (reminder.finished !== 'false') {
                return;
            }

            reminder.getUser().then((user) => {
                ai.say(user, 'Wake up!');

                // let snoozeInterval = setInterval( () => {
                //     this.ai.say(user, 'Wake up!');
                // }, snoozeTimeout);

                reminder.finished = 'done';
                reminder.save();
            });
        });


    }, diff);

    return ai.os.helpers.humanReadable.delay(diff);
}

function scheduleOccurrenceReminder (ai, reminder) {

    let interval = later.setInterval(() =>  {
        reminder.reload().then( () => {
            if (reminder.finished !== 'false') {
                return;
            }

            reminder.getUser().then((user) => {
                ai.say(user, 'Wake up!');

                // let snoozeInterval = setInterval( () => {
                //     this.ai.say(user, 'Wake up!');
                // }, snoozeTimeout);

                // reminder.finished = 'done';
                // reminder.save();
            });
        });
    }, JSON.parse(reminder.date));
}

/*
function StopWakeUpDate (ai) {

    this.ai = ai;
    this.id = 'stop-wake-up';

    this.timeouts = {};

    this.valid = function (user, message, words) {
        return ns.parse(message, 'stop wake me up');
    };

    this.do = function (user, message, words, result) {
        let diff = result.date.start.date() - new Date();
        let delay = ai.os.helpers.humanReadable.delay(diff);

        this.ai.say(user, 'Ok I will wake you up in '+delay+'!');

        let id = randomstring.generate();

        let timeout = setTimeout(() => {
            this.ai.say(user, 'Wake up!');

            let snoozeInterval = setInterval( () => {
                this.ai.say(user, 'Wake up!');
            }, snoozeTimeout);
        }, diff);
    };
}*/

function WakeUpDate (ai) {

    this.ai = ai;
    this.id = 'wake-up-date';


    this.valid = function (user, message, words) {
        return ns.parse(message, 'wake me up {{date:date}}');
    };

    this.do = function (user, message, words, result) {
        Reminder.create({
            type: 'date',
            subtype: 'wake-up',
            content: '',
            date: result.date.start.date().toUTCString(),
            finished: 'false'
        }).then( (reminder) => {
            reminder.setUser(user),
            reminder.save();
            // console.log(reminder.getUser());
            let delay = scheduleDateReminder(this.ai, reminder);
            ai.say(user, 'Ok I will wake you up in '+delay+'!');
        });


        // let timeout = setTimeout(() => {
        //     this.ai.say(user, 'Wake up!');
        //
        //     let snoozeInterval = setInterval( () => {
        //         this.ai.say(user, 'Wake up!');
        //     }, snoozeTimeout);
        // }, diff);
    };
}

function WakeUp (ai) {

    this.ai = ai;
    this.id = 'wake-up';

    this.valid = function (user, message, words) {
        return ns.parse(message, 'wake me up {{occurrence:occurrence}}');
    };

    this.do = function (user, message, words, result) {
        Reminder.create({
            type: 'occurrence',
            subtype: 'wake-up',
            content: '',
            date: JSON.stringify(result.occurrence.laterjs),
            finished: 'false'
        }).then( (reminder) => {
            reminder.setUser(user),
            reminder.save();
            scheduleOccurrenceReminder(this.ai, reminder);
            // ai.say(user, 'Ok I will wake you up in '+delay+'!');
        });
    };
}

module.exports = function (ai) {

    Reminder.findAll({
        where: {
            finished: 'false',
            type: 'date',
            subtype: 'wake-up'
        }
    }).then((reminders) => {
        reminders.forEach( (reminder) => {
            let delay = scheduleDateReminder(ai, reminder);
            reminder.getUser().then( (user) => {
                // console.log('ok', user.name, delay);
                ai.say(user, 'Ok I will wake you up in '+delay+'!');
            });
        });
    });

    Reminder.findAll({
        where: {
            finished: 'false',
            type: 'occurrence',
            subtype: 'wake-up'
        }
    }).then((reminders) => {
        reminders.forEach( (reminder) => {
            scheduleOccurrenceReminder(ai, reminder);
        });
    });

    return [
        // new StopWakeUpDate(ai),
        new WakeUpDate(ai),
        new WakeUp(ai)
    ];
};
