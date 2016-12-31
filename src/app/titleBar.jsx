import React from 'react'

import SessionControl from './sessionControl'
import state from './state/'

class TitleBar extends React.Component {

  render() {
    return (
      <div className="flex-column">
        <img src="/app/king-pong-logo-wide.png" className="logo" onClick={this._clickLogo.bind(this)} />
        <SessionControl />
      </div>
    )
  }

  _clickLogo() {
    state.setPage('leaderboard')
  }

}

export default TitleBar
