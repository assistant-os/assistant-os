import weather from 'openweathermap'

export const getTodayWeather = (location) => {
  return new Promise((resolve, reject) => {
    weather.forecast({ q: location, APPID: process.env.OPENWEATHERMAP_API_KEY }, (err, json) => {
      if (err) {
        console.log('error fds')
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
        console.log('else')
        reject(json)
      }
    })
  })
}

export default {
  getTodayWeather: getTodayWeather,
}
