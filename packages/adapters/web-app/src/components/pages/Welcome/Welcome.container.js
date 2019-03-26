import { connect } from 'react-redux'
import { getMessages } from 'redux/discussion'
import component from './Welcome'

const mapStateToProps = state => ({
  messages: getMessages(state),
})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(component)
