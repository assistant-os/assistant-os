import { connect } from 'react-redux'
import { setStarted } from 'redux/credentials'

import component from './Welcome'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  start: () => dispatch(setStarted(true)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(component)
