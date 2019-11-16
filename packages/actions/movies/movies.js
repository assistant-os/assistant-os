import { Action, Cache } from '@assistant-os/utils'
import { initializeTable } from './movies.service'
import searchMovies from './themoviedb'

export default class Movies extends Action {
  constructor() {
    super('movies')

    this.cache = new Cache()
  }

  start() {
    initializeTable()
  }
  stop() {}

  evaluateProbability(message) {
    if (!message.text) {
      return Promise.resolve(0)
    }

    return searchMovies(message.text)
      .catch(() => [])
      .then(movies => {
        if (movies.length > 0) {
          this.cache.add(message, { movies })
          return 0.85
        }
        return 0
      })
  }

  respond(message) {
    const { movies } = this.cache.get(message)

    const text = movies.map(({ title }) => title).join(', ')
    const list = movies.map(
      ({ releaseDate, originalLanguage, adult, ...movie }) => ({
        subtitle: releaseDate,
        tags: [originalLanguage, adult ? ['adult'] : []],
        ...movie,
      })
    )

    this.sendMessage(
      {
        text,
        list,
      },
      {
        previousMessage: message.id,
      }
    )
  }
}
