import { connect } from 'react-redux'
import { isStarted } from 'redux/credentials'
import { withRouter } from 'react-router-dom'

import component from './App'

const mapStateToProps = state => ({
  started: isStarted(state),
})

const mapDispatchToProps = dispatch => ({})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(component)
)
