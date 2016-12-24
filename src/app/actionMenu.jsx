import { observer } from 'mobx-react'
import React from 'react'

import state from './state/'
import TitleBar from './titleBar'

@observer
class ActionMenu extends React.Component {

  render() {
    const getContent = () => {
      if (state.selectedPlayers.length === 0) {
        return 'Select 2 players to begin.'
      } else if (state.selectedPlayers.length === 1) {
        return 'Select 1 more player!'
      } else if (state.selectedPlayers.length === 2) {
        return (
          <section>
            <button onClick={this._handleClick.bind(this)}>PLAY</button>
            <button onClick={this._handleCancel.bind(this)}>CANCEL</button>
          </section>
        )
      } else {
        return 'Too many players, bro.'
      }
    }
    return (
      <header>
        <TitleBar />
        <span>
          {getContent()}
        </span>
      </header>
    )
  }

  _handleCancel() {
    state.selectedPlayers = []
  }

  _handleClick(evt) {
    state.page = 'game'
    state.winner = null
  }
}

export default ActionMenu
