import React, { useEffect, useState } from 'react'
import { Route } from 'react-router-dom'

// import Detail from 'components/pages/Detail'
import Welcome from 'components/pages/Welcome'
import Discussion from 'components/pages/Discussion'

import style from './App.module.scss'

// class App extends Component {
//   componentDidMount () {
//     if (this.props.started) {
//       this.props.history.push('/chat')
//       console.log('chat')
//     } else {
//       this.props.history.push('/welcome')
//     }
//   }
//   componentDidUpdate (prevProps) {
//     console.log('componentDidUpdate')
//     if (this.props.started && !prevProps.started) {
//       console.log('chat')
//       this.props.history.push('/chat')
//     } else if (!this.props.started && prevProps.started) {
//       console.log('welcome')

//       this.props.history.push('/welcome')
//     }
//   }
//   render () {
//     return (
//       <div className={style.App}>
//         <Route path="/messages/:messageIndex/:detailId" component={Detail} />
//         <Route path="/chat" component={Chat} />
//         <Route path="/welcome" component={Welcome} />
//       </div>
//     )
//   }
// }

// export default App

export default ({ history }) => {
  // useEffect(() => {
  //   if (started) {
  //     history.push('/chat')
  //     console.log('chat')
  //   } else {
  //     history.push('/welcome')
  //   }
  // }, [])
  const [started, start] = useState(true)
  return (
    <div className={style.App}>
      {started ? <Discussion /> : <Welcome onStart={start} />}
    </div>
  )
}
