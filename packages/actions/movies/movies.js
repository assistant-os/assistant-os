import { Action, Cache } from '@assistant-os/common'
import { initializeTable } from './movies.service'
import searchMovies from './themoviedb'

const action = new Action('emails')

const cache = new Cache()

action.onStart = () => {
  initializeTable()
}

const findMovie = (text, userId, message) =>
  cache.has(message)
    ? cache.get(message)
    : searchMovies(text)
        .catch(() => [])
        .then(movies => {
          if (movies.length > 0) {
            const results = { movies }
            cache.add(message, results)
            return results
          }
          return false
        })

action.when(findMovie, 0.85).then(({ movies, message }) => {
  const answer = movies.map(({ title }) => title).join(', ')
  const list = movies.map(
    ({ releaseDate, originalLanguage, adult, ...movie }) => ({
      subtitle: releaseDate,
      tags: [originalLanguage, adult ? ['adult'] : []],
      ...movie,
    })
  )

  action.sendMessage(
    {
      text: answer,
      list,
    },
    {
      previousMessage: message.id,
    }
  )

  cache.remove(message)
})

export default action
