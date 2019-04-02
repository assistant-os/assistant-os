import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Wave from 'components/atoms/Wave'

import style from './Welcome.module.scss'

class Welcome extends Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)

    this.state = {
      show: false,
    }

    // if (this.props.messages.length > 0) {
    //   this.handleClick()
    // }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        show: true,
      })
    }, 200)
  }

  componentDidUpdate (prevProps) {
    // const { messages } = this.props
    // if (messages.length !== prevProps.messages.length) {
    //   this.handleClick()
    // }
  }

  handleClick () {
    this.props.start()
  }

  render () {
    const { show } = this.state
    return (
      <div className={style.Welcome}>
        <h1 className={style.title}>Assistant OS</h1>
        {show ? <Wave height={150} /> : null}
        <div className={style.footer}>
          <div
            type="button"
            className={style.button}
            onClick={this.props.start}
          >
            Start the discussion
          </div>
        </div>
      </div>
    )
  }
}

Welcome.defaultProps = {
  start: () => {},
}

Welcome.propTypes = {
  start: PropTypes.func,
}

export default Welcome
