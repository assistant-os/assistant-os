import React from 'react'
import { connect } from 'react-redux'

import { getMemory, setValue } from 'redux/os'

import component from './DetailItem'

const mapStateToProps = (state, { actions, id }) => {
  let values = {}

  actions.forEach(action => {
    values[action.id] = getMemory(state, `${action.id}.${id}`)
  })

  return {
    values,
  }
}

const mapDispatchToProps = dispatch => ({
  onChange: (id, value) => dispatch(setValue(id, value)),
})

const forwardRef = WrappedComponent => {
  return React.forwardRef((props, ref) => {
    return <WrappedComponent {...props} forwardedRef={ref} />
  })
}

export default forwardRef(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(component)
)
