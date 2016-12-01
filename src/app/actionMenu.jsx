import {observer} from 'mobx-react'
import React from 'react'

import state from './state/'

@observer
class ActionMenu extends React.Component {
  constructor() {
    super()

    this.text = ''
  }
  render() {
    switch (state.selectedPlayers.length) {
      case 0:
        this.text = 'Select 2 players to begin'
        break
      case 1:
        this.text = 'Select 1 more player!'
        break
      case 2:
        this.text = "Let's play a game!"
        break
      default:
        this.text = 'Shit broke'

    }
    return (
      <section id='actionMenu' onClick={this._handleClick.bind(this)}>
        <h3>{this.text}</h3>
      </section>
    )
  }

  _handleClick(evt) {
    console.warn('click')
  }
}

export default ActionMenu
