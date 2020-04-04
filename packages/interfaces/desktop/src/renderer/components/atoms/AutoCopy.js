import React, { useRef } from 'react'

export default ({ children }) => {
  const ref = useRef()

  const onClick = () => {
    if (window.getSelection && document.createRange) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(ref.current)
      selection.removeAllRanges()
      selection.addRange(range)
    } else if (document.selection && document.body.createTextRange) {
      const range = document.body.createTextRange()
      range.moveToElementText(ref.current)
      range.select()
    }
  }

  return (
    <span ref={ref} onClick={onClick}>
      {children}
    </span>
  )
}
