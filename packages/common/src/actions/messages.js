const fixPunctuation = text => {
  const finishByPunctuation = /[.?!]$/.test(text[text.length - 1])
  const punctuation = finishByPunctuation ? '' : '.'

  return `${text.replace(/^[a-z]/, text[0].toUpperCase())}${punctuation}`
}

export const improveTextMessage = text => {
  return fixPunctuation(text)
}
