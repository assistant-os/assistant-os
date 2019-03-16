import axios from 'axios'
import { WebSocketModule } from '@assistant-os/utils'

export default class extends WebSocketModule {
  constructor ({ apiKey, ...props }) {
    super({ label: 'movies', ...props })

    this.apiKey = apiKey
    this.cache = {}
  }

  evaluateProbability ({ format, content }) {
    return new Promise((resolve, reject) => {
      if (format !== 'text') {
        resolve(0)
        return
      }
      axios
        .get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: this.apiKey,
            query: content,
          },
        })
        .then(({ data }) => {
          const { success, results } = data
          if (success === false) {
            resolve(0)
          } else {
            const movies = []
            const memory = {}
            results
              .filter(({ popularity }) => popularity > 10) // we list only popular movies
              .forEach(
                ({
                  id,
                  title,
                  overview,
                  release_date,
                  backdrop_path,
                  original_language,
                  adult,
                }) => {
                  const tags = []
                  tags.push(original_language)
                  if (adult) {
                    tags.push('adult')
                  }

                  movies.push({
                    id,
                    title,
                    subtitle: release_date,
                    description: overview,
                    image: `https://image.tmdb.org/t/p/original/${backdrop_path}`,
                    tags,
                    actions: [
                      {
                        type: 'toggle',
                        icon: 'favorite',
                        id: 'movies.favorite',
                      },
                    ],
                  })

                  memory[`movies.favorite.${id}`] = false
                }
              )

            const response = {
              format: 'list',
              content: {
                list: movies,
              },
              memory,
            }

            this.cache[content] = response
            resolve(movies.length > 0 ? 0.85 : 0)
          }
        })
        .catch(error => {
          resolve(0)
        })
    })
  }

  answer ({ format, content }) {
    return new Promise((resolve, reject) => {
      if (content in this.cache) {
        resolve(this.cache[content])
      } else {
        reject()
      }
    })
  }
}
