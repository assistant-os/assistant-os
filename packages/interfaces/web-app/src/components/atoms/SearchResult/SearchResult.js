import React from 'react'
import PropTypes from 'prop-types'

import style from './SearchResult.module.scss'

const SearchResult = ({ onClick, active, label, highlight, icon }) => (
  <div
    className={`${style.SearchResult} ${active ? style.active : ''}`}
    onClick={onClick}
  >
    <div className={style.label}>{label}</div>
    <div className={style.icon}>{icon}</div>
  </div>
)

SearchResult.defaultProps = {
  onClick: () => {},
  active: false,
  label: '',
  highlight: '',
  icon: [],
}

SearchResult.propTypes = {
  onClick: PropTypes.func,
  active: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  highlight: PropTypes.string,
  icon: PropTypes.node,
}

export default SearchResult
