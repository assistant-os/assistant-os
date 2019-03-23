import axios from 'axios'
import path from 'path'
import fs from 'fs'
import { WebSocketModule } from '@assistant-os/utils'

export default class extends WebSocketModule {
  constructor ({ apiKey, ...props }) {
    super({ label: 'movies', ...props })

    this.apiKey = apiKey
    this.cache = {}

    this.favorites = {}

    this.filename = path.join(__dirname, 'data.json')

    fs.readFile(this.filename, 'utf8', (err, data) => {
      if (!err) {
        this.favorites = JSON.parse(data)
      }
    })
  }

  save () {
    fs.writeFile(this.filename, JSON.stringify(this.favorites), () => {})
  }

  evaluateProbability ({ format, content }) {
    return new Promise((resolve, reject) => {
      if (format !== 'text') {
        resolve(0)
        return
      }

      if (content.toLowerCase() === 'movies favorites') {
        resolve(1)
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
                        id: 'movies.favorites',
                      },
                    ],
                  })

                  memory[`movies.favorites.${id}`] =
                    id in this.favorites ? this.favorites[id] : false
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
      if (format === 'text' && content.toLowerCase() === 'movies favorites') {
        let movies = []
        let memory = {}

        let promises = []

        Object.keys(this.favorites).forEach(favoriteId => {
          promises.push(
            new Promise((resolve, reject) => {
              axios
                .get(`https://api.themoviedb.org/3/movie/${favoriteId}`, {
                  params: {
                    api_key: this.apiKey,
                  },
                })
                .then(({ data }) => {
                  const {
                    id,
                    title,
                    overview,
                    release_date,
                    backdrop_path,
                    original_language,
                    adult,
                  } = data
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
                        id: 'movies.favorites',
                      },
                    ],
                  })

                  memory[`movies.favorites.${id}`] =
                    id in this.favorites ? this.favorites[id] : false

                  resolve()
                })
                .catch(error => {})
            })
          )
        })

        Promise.all(promises).then(() => {
          if (movies.length > 0) {
            resolve({
              format: 'list',
              content: {
                list: movies,
              },
              memory,
            })
          } else {
            resolve({
              format: 'text',
              content: 'No favorite movies',
            })
          }
        })
      } else if (content in this.cache) {
        resolve(this.cache[content])
      } else {
        reject()
      }
    })
  }

  setValue ({ id, messageId, value }) {
    const match = id.match(/movies\.favorites\.([0-9]+)/)
    if (match) {
      this.favorites[parseInt(match[1])] = value
      this.save()
    }
  }
}
