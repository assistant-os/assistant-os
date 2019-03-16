import { connect } from 'react-redux'
import { getMessages } from 'redux/discussion'
import { withRouter } from 'react-router-dom'

import component from './Detail'

const mapStateToProps = (state, { match }) => {
  const { format, content } = getMessages(state)[match.params.messageIndex]

  return {
    format,
    content,
  }
}

const mapDispatchToProps = dispatch => ({})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(component)
)
