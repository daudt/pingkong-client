import {observer} from 'mobx-react'
import React from 'react'
import ReactDOM from 'react-dom'

import ActionMenu from './actionMenu'
import Game from './game'
import Leaderboard from './leaderboard'
import state from './state/'

import './app.less'

@observer
class App extends React.Component {
  render() {
    if (state.page === 'game') {
      return (
        <Game />
      )
    }
    else {
      return (
        <section>
          <h1>King of Pong Mountain</h1>
          <Leaderboard />
          <ActionMenu />
        </section>
      )
    }
  }
}

ReactDOM.render((
  <App />
), document.querySelector('main'))
