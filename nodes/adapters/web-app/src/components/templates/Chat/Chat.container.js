import { connect } from 'react-redux'
import { addMessage, getMessages, clearMessages } from 'redux/discussion'
import {
  setToken,
  getToken,
  setHost,
  getHost,
  clearCredentials,
} from 'redux/credentials'

import { init, sendMessage } from 'redux/os'

import component from './Chat'

const mapStateToProps = state => ({
  messages: getMessages(state),
  token: getToken(state),
  host: getHost(state),
})

const mapDispatchToProps = dispatch => ({
  addMessage: (emitter, content, type) =>
    dispatch(addMessage(emitter, content, type)),
  setToken: token => dispatch(setToken(token)),
  setHost: host => dispatch(setHost(host)),
  clearMemory: () => {
    dispatch(clearMessages())
    dispatch(clearCredentials())
  },
  connect: (host, token) => dispatch(init(host, token)),
  sendMessage: (token, format, content) =>
    dispatch(sendMessage(token, format, content)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(component)
