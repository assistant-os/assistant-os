import moment from 'moment'

import Middleware from '../../os/middleware'
import weatherDiscover from '../../helpers/weather'

import wakeUp from '../event/wake-up'

/**
 * Middleware to inform user about the weather
 * @type {Middleware}
 */
const weather = new Middleware({
  id: 'weather',
  description: 'inform you about the weather'
})

weather.hear('weather today', (req, res) => {
  weatherDiscover.getTodayWeather('grenoble').then((result) => {
    if (result.length === 0) {
      res.reply(`Sorry it is too late to get today weather`)
    } else {
      res.reply('Today')
      for (const t of result) {
        const hour = moment(t.dt_txt).format('hh:mm')
        weather.log('info', { date: hour, weather: t.weather[0].description })
        res.reply(`at ${hour} : ${t.weather[0].description}`)
      }
    }

  }).catch((error) => {
    res.reply(`Sorry, impossible to get the weather: ${error}`)
    weather.log('error', 'weather-today', { error })
  })
})

weather.hear('weather {{date:date}}', (req, res) => {
  weatherDiscover.getWeather('grenoble', req.parsed.date.start.date()).then((result) => {
    if (result === null) {
      res.reply(`Sorry I cannot estimate the weather.`)
    } else {
      res.reply(`${moment(req.parsed.date.start.date()).format("dddd, MMMM Do")}, the weather will be: ${result.weather[0].description}.`)
    }
  }).catch((e) => {
    res.reply(`Sorry, impossible to get the weather: ${error}`)
    weather.log('error', 'weather-day', { error })
  })
})

wakeUp.on('woke-up', ({ event }) => {
  setTimeout(() => {
    weatherDiscover.getTodayWeather('grenoble').then((result) => {
      if (result.length === 0) {
        weather.speak(event.event.user, `Sorry it is too late to get today weather`)
      } else {
        weather.speak(event.event.user, 'Weather is estimated:')
        for (const t of result) {
          const hour = moment(t.dt_txt).format('HH:mm')
          weather.speak(event.event.user, `at ${hour} : ${t.weather[0].description}`)
        }
      }
    }).catch((error) => {
      weather.speak(event.event.user, `Sorry, impossible to get the weather: ${error}`)
      weather.log('error', 'weather-woke-up', { error })
    })
  }, 1000 * 60 * 30)
})

export default weather
