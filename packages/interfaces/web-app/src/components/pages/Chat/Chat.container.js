import { connect } from 'react-redux'
import { getMessages, clearMessages } from 'redux/discussion'
import { clearCredentials, isStarted } from 'redux/credentials'

import { sendMessage, tryConnection } from 'redux/os'

import component from './Chat'

const mapStateToProps = state => ({
  messages: getMessages(state),
  started: isStarted(state),
})

const mapDispatchToProps = dispatch => ({
  clearMemory: () => {
    dispatch(clearMessages())
    dispatch(clearCredentials())
  },
  sendMessage: (format, content) => dispatch(sendMessage(format, content)),
  connect: () => dispatch(tryConnection()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(component)
