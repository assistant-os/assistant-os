import Middleware from '../../os/middleware'

import { getTodayWeather } from '../../helpers/weather'

const meteo = new Middleware('meteo')

meteo.hear('meteo', (req, res) => {
  getTodayWeather('grenoble').then((result) => {
    for (const t of result) {
      const date = new Date(t.dt_text)
      meteor.log('info', { date: date.toString(), weather: t.weather[0].description })
      res.reply(`at ${date.toString()} : ${t.weather.description}`)
    }
  }).catch((error) => {
    res.reply('Sorry, impossible to get the weather')
    meteo.log('error', { error })
  })
})

export default meteo
