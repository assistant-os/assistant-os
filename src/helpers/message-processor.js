import metaResponse from './meta-response'

export function processResponse (response) {
  let text = ''
  if (typeof response === 'string') {
    text = response
  } else if (typeof response === 'function') {
    text = response()
  } else if (response instanceof Array) {
    text = response.join('\n')
  }
  return text
}

function pickChoice (choices) {
  if (choices instanceof Array && choices.length > 0) {
    return choices[Math.floor(Math.random() * 10 % choices.length)]
  }
}

export function random (choice) {
  if (metaResponse.hasOwnProperty(choice)) {
    return pickChoice(metaResponse[choice])
  } else {
    return pickChoice(choice)
  }
}

export default {
  processResponse,
  pickChoice,
  random,
}
