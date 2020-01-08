import React from 'react'
import PropTypes from 'prop-types'

import Wave from 'components/atoms/Wave'

import style from './Welcome.module.scss'

const Welcome = ({ onStart }) => (
  <div className={style.Welcome}>
    <h1 className={style.title}>Assistant OS</h1>
    <Wave height={150} />
    <div className={style.footer}>
      <div type="button" className={style.button} onClick={onStart}>
        Start the discussion
      </div>
    </div>
  </div>
)

Welcome.defaultProps = {
  onStart: () => {},
}

Welcome.propTypes = {
  onStart: PropTypes.func,
}

export default Welcome
