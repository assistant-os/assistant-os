import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DetailItem from 'components/organisms/DetailItem'

import style from './Detail.module.scss'

class Detail extends Component {
  constructor (props) {
    super(props)

    this.items = []
  }

  componentDidMount () {
    setTimeout(() => {
      const offset = this.items[this.props.match.params.detailId].offsetLeft
      this.container.scrollLeft = offset
    }, 0)
  }

  showAfterScroll () {
    this.setState({
      show: true,
    })
  }

  render () {
    const { content } = this.props
    return (
      <div className={style.Detail} ref={ref => (this.container = ref)}>
        <div
          className={style.list}
          style={{ width: `${content.list.length * 100}%` }}
        >
          {content.list.map(
            (
              { id, title, image, description, tags, subtitle, actions },
              index
            ) => (
              <DetailItem
                ref={ref => (this.items[index] = ref)}
                key={id}
                id={id}
                style={{ width: `${100 / content.list.length}%` }}
                title={title}
                image={image}
                description={description}
                tags={tags}
                subtitle={subtitle}
                actions={actions}
              />
            )
          )}
        </div>
      </div>
    )
  }
}

Detail.defaultProps = {
  format: '',
  content: {},
  match: { params: { detailId: '' } },
}

Detail.propTypes = {
  format: PropTypes.string,
  content: PropTypes.shape({
    list: PropTypes.array,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      detailId: PropTypes.string,
    }),
  }),
}

export default Detail
