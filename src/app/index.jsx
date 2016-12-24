import { observer } from 'mobx-react'
import React from 'react'
import ReactDOM from 'react-dom'

import ActionMenu from './actionMenu'
import Background from './background'
import Game from './game'
import Leaderboard from './leaderboard'
import Logo from './logo'
import LoginPage from './loginPage'
import RegisterPage from './registerPage'
import Toast from './toast'
import state from './state/'

import './app.less'

const DEFAULT_PAGE = 'logo'

@observer
class App extends React.Component {
  render() {
    const PAGE_TEMPLATES = {
      logo: (
        <section className="logoContainer">
          <Logo dest="leaderboard" />
        </section>
      ),
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
      ),
      login: (
        <section className="UIOverlay">
          <LoginPage />
        </section>
      ),
      register: (
        <section className="UIOverlay">
          <RegisterPage />
        </section>
      )
    }

    const pageTemplate = PAGE_TEMPLATES[state.page] || PAGE_TEMPLATES[DEFAULT_PAGE]

    return (
      <section>
        <Background />
        <Toast />
        {pageTemplate}
      </section>
    )
  }
}

ReactDOM.render((
  <App />
), document.querySelector('main'))
