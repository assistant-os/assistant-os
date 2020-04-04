import React from 'react'

import ListItem from '@/components/molecules/ListItem'
import style from './List.style'

export default ({ className, items, active = null, onClick = () => {} }) => (
  <div className={`${style.List} ${className}`}>
    {items.map((item, index) => (
      <ListItem
        key={item.id}
        active={active && active.id === item.id}
        onClick={event => onClick(index)}
        help={item.subLabel}
        icon={item.icon}
      >
        {item.label}
      </ListItem>
    ))}
  </div>
)
