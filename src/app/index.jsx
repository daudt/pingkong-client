import { observer } from 'mobx-react'
import React from 'react'
import ReactDOM from 'react-dom'

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

const PAGE_TEMPLATE_FNS = {
  logo: () => (
    <section className="logoContainer">
      <Logo dest="leaderboard" />
    </section>
  ),
  game: (props) => {
    const gameElement = React.createElement(Game, props)
    return (
      <section className="UIOverlay">
        {gameElement}
      </section>
    )
  },
  leaderboard: () => (
    <section className="UIOverlay">
      <Leaderboard />
    </section>
  ),
  login: () => (
    <section className="UIOverlay">
      <LoginPage />
    </section>
  ),
  register: () => (
    <section className="UIOverlay">
      <RegisterPage />
    </section>
  )
}

@observer
class App extends React.Component {
  render() {

    const pageTemplateFn = PAGE_TEMPLATE_FNS[state.currentPage.name] || PAGE_TEMPLATE_FNS[DEFAULT_PAGE]

    return (
      <section>
        <Background />
        <Toast />
        {pageTemplateFn(state.currentPage.props)}
      </section>
    )
  }
}

ReactDOM.render((
  <App />
), document.querySelector('main'))
