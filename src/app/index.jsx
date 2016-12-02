import {observer} from 'mobx-react'
import React from 'react'
import ReactDOM from 'react-dom'

import ActionMenu from './actionMenu'
import Background from './background'
import Game from './game'
import Leaderboard from './leaderboard'
import state from './state/'

import './app.less'

@observer
class App extends React.Component {
  render() {
    console.warn(state.page)
    return (
      <section>
        <Background />
        {
          state.page === 'game'
            ? <section className="UIOverlay"><Game /></section>
            : <section className="UIOverlay"><Leaderboard /><ActionMenu /></section>
        }
      </section>
    )
  }
}

ReactDOM.render((
  <App />
), document.querySelector('main'))
