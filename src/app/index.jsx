import {observer} from 'mobx-react'
import React from 'react'
import ReactDOM from 'react-dom'

import ActionMenu from './actionMenu'
import Background from './background'
import Game from './game'
import Leaderboard from './leaderboard'
import state from './state/'

import './app.less'

const DEFAULT_PAGE = 'leaderboard'

@observer
class App extends React.Component {
  render() {
    console.warn(state.page)

    const PAGE_TEMPLATES = {
      game: (
        <section className="UIOverlay">
          <Game />
        </section>
      ),
      leaderboard: (
        <section className="UIOverlay">
          <Leaderboard />
          <ActionMenu />
        </section>
      )
    }

    const pageTemplate = PAGE_TEMPLATES[state.page] || PAGE_TEMPLATES[DEFAULT_PAGE]

    return (
      <section>
        <Background />
        {pageTemplate}
      </section>
    )
  }
}

ReactDOM.render((
  <App />
), document.querySelector('main'))
