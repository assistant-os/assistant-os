import thesaurus from 'thesaurus'

import db from './db'

const TABLE_NAME = 'synonyms'

const initializeTable = () => {
  if (
    db() &&
    !db()
      .has(TABLE_NAME)
      .value()
  ) {
    db()
      .set(TABLE_NAME, [])
      .write()
  }
}

export const getSynonyms = word => {
  initializeTable()

  let found = db()
    .get(TABLE_NAME)
    .find({ word })
    .value()

  if (found) {
    return found.synonyms
  }

  const synonyms = [...thesaurus.find(word), word]

  db()
    .get(TABLE_NAME)
    .push({ word, synonyms })
    .write()

  return synonyms
}

export const getASynonym = word => {
  const synonyms = getSynonyms(word)

  const index = Math.floor(Math.random() * synonyms.length)

  return synonyms[index]
}
