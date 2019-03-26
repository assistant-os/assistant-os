import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Action from 'components/atoms/Action'

import style from './DetailItem.module.scss'

class Detail extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (id) {
    return value => {
      const { onChange } = this.props
      onChange(id, value)
    }
  }
  render () {
    const {
      id,
      values,
      title,
      subtitle,
      description,
      image,
      tags,
      actions,
      style: parentStyle,
      forwardedRef,
    } = this.props
    return (
      <div
        ref={forwardedRef}
        className={style.item}
        style={parentStyle}
        id={id}
      >
        <div className={style.imageContainer}>
          <img alt="item" src={image} className={style.image} />
        </div>
        <h1 className={style.title}>{title}</h1>
        <div className={style.banner}>
          <div className={style.info}>
            <h2 className={style.subtitle}>{subtitle}</h2>
            <div className={style.tags}>
              {tags.map(tag => (
                <div key={tag} className={style.tag}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div className={style.actions}>
            {actions.map(({ id: actionId, icon, type }) => (
              <Action
                key={actionId}
                className={style.actionItem}
                id={actionId}
                icon={icon}
                type={type}
                value={values[actionId]}
                onChange={this.handleChange(`${actionId}.${id}`)}
              />
            ))}
          </div>
        </div>

        <div className={style.description}>{description}</div>
      </div>
    )
  }
}

Detail.defaultProps = {
  id: 0,
  title: '',
  subtitle: '',
  description: '',
  tags: [],
  actions: [],
  image: '',
  style: {},
  values: {},
  onChange: () => {},
}

Detail.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
  images: PropTypes.string,
  style: PropTypes.object,
  values: PropTypes.object,
  onChange: PropTypes.func,
}

export default Detail
