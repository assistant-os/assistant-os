import ns from 'natural-script'
import later from 'later'
import winston from 'winston'

import Middleware from '../os/middleware'
import User from '../models/user'
import { default as Event, STATE as EventState, TYPE as EventType } from '../models/event'

later.date.localTime()

let scheduler = new Middleware(ns.parse)

function scheduleDateReminder (event, callback) {
    winston.info('schedule date')
    // console.log(JSON.parse(event.date).start)
    let diff = new Date(event.date) - new Date()
    //console.log('diff', diff)

    if (diff <= 0) {
        event.update({
            state: EventState.PASSED
        })
        return
    }


    /*let timeout = */setTimeout(() => {

        event.reload().then(() => {
            if (event.state !== EventState.READY) {
                return
            }

            scheduler.emit('event.ready', event)
        })


    }, diff)

    scheduler.emit('event.scheduled', { diff: diff, event: event })

    // return ai.os.helpers.humanReadable.delay(diff)
}

scheduler.hear('list event', (req, res) => {
    Event.findAll({
        attributes: [ 'id', 'type', 'name', 'context', 'date' ],
        where: {
            state: EventState.READY,
            userId: req.user.id
        }
    }).then((events) => {
        // console.log(reminders
        let s = ''
        for (let i in events) {
            let event = events[i]
            s += `\n`
            s += `\tid: ${event.id}\n`
            s += `\ttype: ${event.type}\n`
            s += `\tname: ${event.name}\n`
            s += `\tcontext: ${event.context}\n`
            s += `\tdate: ${event.date}\n`
        }

        if (s === '') {
            res.reply('no event found')
        } else {
            res.reply(`events: ${s}`)
        }

    })
})

scheduler.schedule = (user, type, name, date, content = '', callback) => {
    Event.create({
        type: type,
        name: name,
        content: content,
        date: date,
        state: EventState.READY
    }).then((event) => {
        if (event) {
            // console.log('created')
            event.setUser(user)
            event.save().then(() => {
                Event.findOne({
                    where: {
                        id: event.id
                    },
                    include: [ {
                        model: User
                    } ]
                }).then((event) => {
                    scheduleDateReminder(event)
                })
                // console.log(event.getUser())
            })
        }
    })
}

export default scheduler

Event.findAll({
    where: {
        state: EventState.READY,
        type: EventType.ONE_SHOT
    },
    include: [ {
        model: User
    } ]
}).then((events) => {
    console.log('events', events.length)
    events.forEach((event) => {
        // console.log(event.user.name)
        scheduleDateReminder(event)
    })
})
