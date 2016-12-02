import {observer} from 'mobx-react'
import React from 'react'

import state from './state/'

@observer
class ActionMenu extends React.Component {
  constructor() {
    super()
  }
  render() {
    let text = null
    let klass = null
    switch (state.selectedPlayers.length) {
      case 0:
        text = 'Select 2 players to begin.'
        break
      case 1:
        text = 'Select 1 more player!'
        break
      case 2:
        text = (
          <section>
            <button onClick={this._handleClick.bind(this)}>PLAY</button>
            <button onClick={this._handleCancel.bind(this)}>CANCEL</button>
          </section>
        )
        klass = 'ready'
        break
      default:
        text = "That's too many players! Select 2 to begin a game."
        klass = 'invalid'

    }
    return (
      <header className={klass}>
        <span>
          <img src="/app/king-pong-logo-wide.png" className="logo" />
        </span>
        <span>
          {text}
        </span>
      </header>
    )
  }

  _handleCancel() {
    state.selectedPlayers = []
  }

  _handleClick(evt) {
    if (state.selectedPlayers.length === 2) {
      state.page = 'game'
    }
    else {
      alert('Not ready to play game yet. Select more players')
    }
  }
}

export default ActionMenu
