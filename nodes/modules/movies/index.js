import axios from 'axios'
import { WebSocketModule } from '@assistant-os/utils'

export default class extends WebSocketModule {
  constructor ({ apiKey, ...props }) {
    super({ label: 'movies', ...props })

    this.apiKey = apiKey
    this.cache = {}
  }

  evaluateProbability (message, user) {
    return new Promise((resolve, reject) => {
      axios
        .get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: this.apiKey,
            query: message,
          },
        })
        .then(({ data }) => {
          const { success, results } = data
          if (success === false) {
            resolve(0)
          } else {
            const movies = []
            results
              .filter(({ popularity }) => popularity > 10) // we list only popular movies
              .forEach(({ title, overview }) => {
                movies.push({
                  title,
                  description: overview,
                })
              })

            const response = {
              type: 'list',
              list: movies,
              action: {
                type: 'select',
                multiple: true,
                label: 'Notify me about',
              },
            }
            this.cache[message] = response
            resolve(movies.length > 0 ? 0.85 : 0)
          }
        })
        .catch(error => {
          resolve(0)
        })
    })
  }

  answer (message, user) {
    return new Promise((resolve, reject) => {
      if (message in this.cache) {
        resolve(this.cache[message])
      } else {
        reject()
      }
    })
  }
}
