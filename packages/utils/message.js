import { JaroWinklerDistance } from 'natural'
import { getSynonyms } from './synonyms'

import config from './config'

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

export const fix = message => {
  if (!isTextMessage(message)) {
    return message
  }

  let { text } = message

  text = Array.isArray(text) ? text.join(' ') : text

  const finishByPunctuation = /[.?!]$/.test(text[text.length - 1])
  const punctuation = finishByPunctuation ? '' : '.'

  return {
    ...message,
    text: `${text.replace(/^[a-z]/, text[0].toUpperCase())}${punctuation}`,
  }
}

export const isConfirm = message => equals(message, getSynonyms('yes'))

export const isCancel = message => equals(message, getSynonyms('no'))

export const link = (text, url) => `[${text}](${url})`
