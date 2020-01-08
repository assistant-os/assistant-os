import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import style from './ListMessage.module.scss'

const shortText = (description, maxLength) => {
  if (description.length <= maxLength) {
    return description
  }

  const spaceIndex =
    maxLength +
    description.substring(maxLength, description.length).indexOf(' ')

  const newDescription = description.substring(0, spaceIndex)

  return `${newDescription}...`
}

class ListMessage extends Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (index2) {
    return () => {
      const { index, history } = this.props
      history.push(`/messages/${index}/${index2}`)
    }
  }

  render () {
    const { className, content } = this.props
    return (
      <div className={`${style.ListMessage} ${className}`}>
        <div className={style.list}>
          {content.list.map(
            ({ id, title, description, image, tags = [], subtitle }, index) => (
              <div
                className={style.item}
                key={id}
                onClick={this.handleClick(index)}
              >
                <div
                  className={style.image}
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                  }}
                />
                <h1 className={style.title}>{title}</h1>
                {/* <div className={style.tags}>
                  {tags.map(tag => (
                    <div className={style.tag} key={tag}>
                      {tag}
                    </div>
                  ))}
                </div> */}
                {/* <h2 className={style.subtitle}>{subtitle}</h2> */}
                <div className={style.description}>
                  {shortText(description, 100)}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    )
  }
}

ListMessage.defaultProps = {
  className: '',
  index: '',
  content: {},
  emitter: 'other',
  history: { push: () => {} },
}

ListMessage.propTypes = {
  className: PropTypes.string,
  index: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  content: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  emitter: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}

export default withRouter(ListMessage)
