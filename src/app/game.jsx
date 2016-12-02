import {observer} from 'mobx-react'
import React from 'react'

import Api from './api/'
import state from './state/'

@observer
class Game extends React.Component {
  render() {
    return (
      <section id="game">
        <header
          onClick={this._submitGame.bind(this)}
          className={state.winner ? 'ready' : null}
        >
          {state.winner ? 'Save game!': 'Who was the winner?!'}
        </header>
        <div>
          <div
            onClick={this._handleClick.bind(this, state.selectedPlayers[0])}
            className={state.winner === state.selectedPlayers[0] ? 'winner': null}
          >
            {state.selectedPlayers[0].name}
            <h1>{state.winner === state.selectedPlayers[0] ? 'WINNER' : 'LOSER'}</h1>
          </div>
          <div
            onClick={this._handleClick.bind(this, state.selectedPlayers[1])}
            className={state.winner === state.selectedPlayers[1] ? 'winner': null}
          >
            {state.selectedPlayers[1].name}
            <h1>{state.winner === state.selectedPlayers[1] ? 'WINNER' : 'LOSER'}</h1>
          </div>
        </div>
      </section>
    )
  }

  _handleClick(winner) {
    state.winner = winner
  }

  _submitGame() {
    Api.postScore()
  }
}

export default Game
