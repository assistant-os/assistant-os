import later from 'later'
import winston from 'winston'

import Middleware from '../os/middleware'
import User from '../models/user'
import { default as Event, STATE as EventState } from '../models/event'
import DateEvent from '../models/date-event'
import OccurrenceEvent from '../models/occurrence-event'

later.date.localTime()

let scheduler = new Middleware()

function scheduleDateReminder (dateEvent, callback) {
    winston.info('schedule date')
    // console.log(JSON.parse(event.date).start)
    let diff = dateEvent.delay
    console.log('diff', diff)

    if (diff < 0) {
        dateEvent.event.pass()
        return
    }


    /*let timeout = */setTimeout(() => {
        console.log('start', dateEvent.event.name)
        dateEvent.reload().then(() => {
            if (!dateEvent.event.ready) {
                return
            }

            scheduler.emit('event.date.done', { event: dateEvent })
        })


    }, diff)

    scheduler.emit('event.scheduled', { diff: diff, event: dateEvent })

    // return ai.os.helpers.humanReadable.delay(diff)
}

function scheduleOccurrenceReminder (occurrenceEvent, callback) {
    winston.info('schedule occurrence')
    // console.log(JSON.parse(event.date).start)

    let occurrence = JSON.parse(occurrenceEvent.occurrence)

    let interval = later.setInterval(() => {
        console.log('start', occurrenceEvent.event.name)
        occurrenceEvent.reload().then(() => {
            if (!occurrenceEvent.event.ready) {
                interval.clear()
                return
            }

            scheduler.emit('event.occurrence.done', { event: occurrenceEvent })
        })
    }, occurrence)

    scheduler.emit('event.scheduled', { event: occurrenceEvent })
}

scheduler.hear('list event', (req, res) => {
    Event.findAll({
        attributes: [ 'id', 'name', 'context' ],
        where: {
            userId: req.user.id
        }
    }).then((events) => {
        // console.log(reminders
        let s = ''
        for (let i in events) {
            s += events[i].toChat()
        }

        if (s === '') {
            res.reply('no event found')
        } else {
            res.reply(`events: \n ${s}`)
        }

    })
})

scheduler.hear('cancel all events', (req, res) => {
    Event.update({
        state: EventState.CANCELED
    }, {
        where: {
            state: EventState.READY,
            userId: req.user.id
        }
    })
    .then(() => {
        res.reply('all event canceled')
    })
    .catch((e) => {
        res.reply('oups bug')
        winston.error('error while cancelling all events', { error: e })
    })
})

scheduler.hear('cancel event {{integer:id}}', (req, res) => {
    // console.log('id', req.parsed.id)
    Event.update({
        state: EventState.CANCELED
    }, {
        where: {
            id: req.parsed.id.integer,
            state: EventState.READY,
            userId: req.user.id
        }
    })
    .spread((count) => {
        console.log('ok', count)
        if (count >= 1) {
            res.reply('event canceled')
        } else {
            res.reply('no event canceled')
        }
    })
    .catch((e) => {
        res.reply('oups bug')
        winston.error('error while cancelling an event', { error: e })
    })
})

scheduler.scheduleDateEvent = (user, name, date, content = '', callback) => {
    DateEvent.create({
        date: date,
        event: {
            name: name,
            content: content,
        }
    }, {
        include: [ Event ]
    }).then((dateEvent) => {
        if (dateEvent) {
            dateEvent.event.setUser(user)
            dateEvent.save().then(() => {
                DateEvent.findOne({
                    where: {
                        id: dateEvent.id
                    },
                    include: [ {
                        model: Event,
                        include: [ User ]
                    } ]
                }).then((dateEvent) => {
                    scheduleDateReminder(dateEvent)
                })
            })
        }
    })
}

scheduler.scheduleOccurrenceEvent = (user, name, occurrence, content = '', callback) => {
    OccurrenceEvent.create({
        occurrence: JSON.stringify(occurrence),
        event: {
            name: name,
            content: content,
        }
    }, {
        include: [ Event ]
    }).then((occurrenceEvent) => {
        if (occurrenceEvent) {
            occurrenceEvent.event.setUser(user)
            occurrenceEvent.save().then(() => {
                OccurrenceEvent.findOne({
                    where: {
                        id: occurrenceEvent.id
                    },
                    include: [ {
                        model: Event,
                        include: [ User ]
                    } ]
                }).then((occurrenceEvent) => {
                    scheduleOccurrenceReminder(occurrenceEvent)
                })
            })
        }
    })
}


export default scheduler

DateEvent.findAll({
    include: [ {
        model: Event,
        include: [ User ]
    } ]
}).then((events) => {
    events.forEach((event) => {
        scheduleDateReminder(event)
    })
})

OccurrenceEvent.findAll({
    include: [ {
        model: Event,
        include: [ User ]
    } ]
}).then((events) => {
    events.forEach((event) => {
        scheduleOccurrenceReminder(event)
    })
})
