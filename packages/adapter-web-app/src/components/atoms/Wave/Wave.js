import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SiriWave from 'siriwave'

// https://github.com/kopiro/siriwave
class Wave extends Component {
  shouldComponentUpdate () {
    return false
  }

  componentDidMount () {
    const siriWave = new SiriWave({
      container: document.getElementById('siri-container'),
      width:
        this.props.width ||
        Math.min(800, this.container.getBoundingClientRect().width), // this.props.width,
      height: this.props.height,
      speed: 0.05,
      style: 'ios9',
      amplitude: 2,
    })

    siriWave.start()
  }

  render () {
    return (
      <div
        ref={e => (this.container = e)}
        className={this.props.className}
        id="siri-container"
      />
    )
  }
}

Wave.defaultProps = {
  className: '',
  width: 0,
  height: 200,
}

Wave.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default Wave
