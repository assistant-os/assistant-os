import { JaroWinklerDistance } from 'natural'
import { parse } from 'natural-script'
import { getSynonyms } from '../services'

import config from '../../config'

const isTextMessage = message => message && message.text

export const equals = (message, expected) => {
  if (!isTextMessage(message)) {
    return false
  }
  if (typeof expected === 'string') {
    return message.text.toLowerCase() === expected.toLowerCase()
  }

  if (Array.isArray(expected)) {
    return expected.some(e => equals(message, e))
  }
}

export const isCloseTo = (message, expected) => {
  if (!isTextMessage(message)) {
    return false
  }
  if (typeof expected === 'string') {
    return JaroWinklerDistance(message.text, expected) > config.minimalDistance
  }

  if (Array.isArray(expected)) {
    return expected.some(e => isCloseTo(message, e))
  }
}

export const fix = text => {
  const finishByPunctuation = /[.?!]$/.test(text[text.length - 1])
  const punctuation = finishByPunctuation ? '' : '.'

  return `${text.replace(/^[a-z]/, text[0].toUpperCase())}${punctuation}`
}

export const isConfirm = message => equals(message, getSynonyms('yes'))

export const isCancel = message => equals(message, getSynonyms('no'))

export const link = (text, url) => `[${text}](${url})`

export const isCloseToWord = expected => text => {
  const synonymes = getSynonyms(expected)

  const promises = synonymes.map(s => parse(text, s))

  return Promise.all(promises).then(matches =>
    matches.reduce((acc, current) => acc && current, true)
  )
}
