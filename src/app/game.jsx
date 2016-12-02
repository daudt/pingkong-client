import {observer} from 'mobx-react'
import React from 'react'

import Api from './api/'
import state from './state/'

@observer
class Game extends React.Component {

  _getLabel(playerIndex) {
    if (state.winner) {
      if (state.winner === state.selectedPlayers[playerIndex]) {
        return 'WINNER'
      }
      else {
        return 'LOSER'
      }
    }
    else {
      return ''
    }
  }

  _getClass(playerIndex) {
    const classes = ['player']
    if (state.winner) {
      if (state.winner === state.selectedPlayers[playerIndex]) {
        classes.push('winner')
      }
      else {
        classes.push('loser')
      }
    }
    else {
      classes.push('initial')
    }
    return classes.join(' ')
  }

  render() {
    return (
      <section id="game">
        <header
          onClick={this._submitGame.bind(this)}
          className={state.winner ? 'ready' : 'null'}
        >
          <span>
            <img src="/app/king-pong-logo-wide.png" className="logo" />
          </span>
          <span>
            {state.winner ? 'Click here to save the game!': 'Who was the winner?!'}
          </span>
        </header>
        <div>
          <div
            onClick={this._handleClick.bind(this, state.selectedPlayers[0])}
            className={this._getClass(0)}
          >
            <img className='avatar' src={state.selectedPlayers[0].image} />
            {state.selectedPlayers[0].name}
            <h1>{this._getLabel(0)}</h1>
          </div>
          <div className="spacer" />
          <div
            onClick={this._handleClick.bind(this, state.selectedPlayers[1])}
            className={this._getClass(1)}
          >
            <img className='avatar' src={state.selectedPlayers[1].image} />
            {state.selectedPlayers[1].name}
            <h1>{this._getLabel(1)}</h1>
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
