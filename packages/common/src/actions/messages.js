const fixPunctuation = text => {
  const finishByPunctuation = /[.?!]$/.test(text[text.length - 1])
  const punctuation = finishByPunctuation ? '' : '.'

  return `${text.replace(/^[a-z]/, text[0].toUpperCase())}${punctuation}`
}

export const improveTextMessage = (text, options = {}) => {
  if (options.straight) {
    return text
  }
  return fixPunctuation(text)
}

const prefixCommand = name => `/${name} `

export const hasPrefixCommand = (message, name) =>
  message.text && message.text.startsWith(prefixCommand(name))

export const removePrefixCommand = (message, name) => ({
  ...message,
  text: message.text.replace(prefixCommand(name), ''),
})
