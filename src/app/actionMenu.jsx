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
    switch (state.selectedPlayers.length) {
      case 0:
        text = 'Select 2 players to begin'
        break
      case 1:
        text = 'Select 1 more player!'
        break
      case 2:
        text = "Let's play a game!"
        break
      default:
        text = "That's too many players! Select 2 to begin a game."

    }
    return (
      <section id='actionMenu' onClick={this._handleClick.bind(this)}>
        <h3>{text}</h3>
      </section>
    )
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
