import weather from 'openweathermap'

export const getTodayWeather = (location) => {
  return new Promise((resolve, reject) => {
    weather.forecast({ q: location, APPID: process.env.OPENWEATHERMAP_API_KEY }, (err, json) => {
      if (err) {
        reject(err)
      } else if (json.cod === '200') {
        const nextMeteos  = []
        // console.log(json.list)
        for (let i = 0 ; i < json.cnt && nextMeteos.length < 3 ; i++) {
          const date = new Date(json.list[i].dt_txt)
          const now = new Date()
          if (date.getDay() === now.getDay() && date.getHours() >= now.getHours()) {
            nextMeteos.push(json.list[i])
          }
        }
        resolve(nextMeteos)
      } else {
        reject(json)
      }
    })
  })
}

export const getWeather = (location, targetDate) => {
  return new Promise((resolve, reject) => {
    weather.forecast({ q: location, cnt: 16, APPID: process.env.OPENWEATHERMAP_API_KEY }, (err, json) => {
      if (err) {
        reject(err)
      } else if (json.cod === '200') {
        // console.log(JSON.stringify(json, null, 4));
        for (const day of json.list) {
          const date = new Date(day.dt_txt)
          console.log(date.toString())
          console.log('target', targetDate.toString())
          if (targetDate.getDay() === date.getDay()) {
            resolve(day)
            return
          }
        }
        resolve(null)
      } else {
        reject(json)
      }
    })
  })
}

export default {
  getTodayWeather,
  getWeather,
}
