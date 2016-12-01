import {observer} from 'mobx-react'
import React from 'react'

import state from './state/'

@observer
class Game extends React.Component {
  render() {
    return (
      <section id="game">
        <h3>PICK A WINNER</h3>
        <div>
          <div
            onClick={this._handleClick.bind(this, state.selectedPlayers[0])}
            className={state.winner === state.selectedPlayers[0] ? 'selected': null}
          >
            {state.selectedPlayers[0].name}
          </div>
          <h3>VS.</h3>
          <div
            onClick={this._handleClick.bind(this, state.selectedPlayers[1])}
            className={state.winner === state.selectedPlayers[1] ? 'selected': null}
          >
            {state.selectedPlayers[1].name}
          </div>
        </div>
        <button>SAVE GAME</button>
      </section>
    )
  }

  _handleClick(winner, evt) {
    console.warn('click', winner)
    state.winner = winner
  }
}

export default Game
