import React from 'react'

import style from './Icon.style'

export default ({ src, className }) => (
  <i
    className={`${style.Icon} ${className}`}
    dangerouslySetInnerHTML={{ __html: src }}
  />
)
