import axios from 'axios'

import { logger } from '@assistant-os/common'

export default query =>
  axios
    .get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: process.env.THEMOVIEDB_API_KEY,
        query,
      },
    })
    .then(({ data }) => {
      const { success, results } = data
      if (success === false) {
        throw new Error(data)
      }

      return results
        .filter(({ popularity }) => popularity > 10) // we list only popular movies
        .map(
          ({
            id,
            title,
            overview,
            release_date,
            backdrop_path,
            original_language,
            adult,
          }) => ({
            id,
            title,
            releaseDate: release_date,
            description: overview,
            image: `https://image.tmdb.org/t/p/original/${backdrop_path}`,
            originalLanguage: original_language,
            adult,
          })
        )
    })
    .catch(error => {
      logger.error('error while fetch movies from themoviedb', { error })

      return []
    })
