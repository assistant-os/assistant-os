import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import Button from 'components/atoms/Button'

import style from './Welcome.module.scss'

class Welcome extends Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)

    this.state = {
      show: false,
    }

    if (this.props.messages.length > 0) {
      this.handleClick()
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        show: true,
      })
    }, 200)
  }

  componentDidUpdate (prevProps) {
    const { messages } = this.props
    if (messages.length !== prevProps.messages.length) {
      this.handleClick()
    }
  }

  handleClick () {
    this.props.history.push('/messages')
  }

  render () {
    const { show } = this.state
    return (
      <div className={style.Welcome}>
        {show ? (
          <div>
            <h1 className={style.title}>Assistant OS</h1>
            <Button onClick={this.handleClick} className={style.button}>
              Start
            </Button>
          </div>
        ) : null}
      </div>
    )
  }
}

Welcome.defaultProps = {
  messages: [],
  history: { push: () => {} },
}

Welcome.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({})),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}

export default withRouter(Welcome)
