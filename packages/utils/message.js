export const equals = (message, expected) => {
  if (!message.text) {
    return false
  }
  if (typeof expected === 'string') {
    return message.text.toLowerCase() === expected.toLowerCase()
  }

  if (Array.isArray(expected)) {
    return expected.some(e => equals(message, e))
  }
}
