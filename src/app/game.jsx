import { action } from 'mobx'
import { observer } from 'mobx-react'
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
        <header className={state.winner ? 'ready' : 'null'}>
          <span>
            <img src="/app/king-pong-logo-wide.png" className="logo" />
          </span>
          <span>
            {state.winner ? (<button onClick={this._handleRecordMatch.bind(this)}>RECORD MATCH</button>) : 'Who won?'}
            <button onClick={this._handleCancel.bind(this)}>CANCEL</button>
          </span>
        </header>
        <div>
          <div
            onClick={this._handleClick.bind(this, state.selectedPlayers[0])}
            className={this._getClass(0)}
            >
            <img className='avatar' src={state.selectedPlayers[0].image} />
            <span className="userName">
              {state.selectedPlayers[0].nickname}
              <div className="subtle">{state.selectedPlayers[0].name}</div>
            </span>
            <h1>{this._getLabel(0)}</h1>
          </div>
          <div className="spacer" />
          <div
            onClick={this._handleClick.bind(this, state.selectedPlayers[1])}
            className={this._getClass(1)}
            >
            <img className='avatar' src={state.selectedPlayers[1].image} />
            <span className="userName">
              {state.selectedPlayers[1].nickname}
              <div className="subtle">{state.selectedPlayers[1].name}</div>
            </span>
            <h1>{this._getLabel(1)}</h1>
          </div>
        </div>
      </section>
    )
  }

  _handleClick(winner) {
    state.winner = winner
  }

  @action
  _navigateBack() {
    state.winner = null
    state.selectedPlayers = []
    state.page = 'logo'
  }

  _handleRecordMatch() {
    const loser = (state.selectedPlayers[0] !== state.winner) ?
      state.selectedPlayers[0] : state.selectedPlayers[1]

    Api.addMatch(state.winner, loser).then((lastMatch) => {
      console.warn('winner:', lastMatch.winner.name,
        'old rating:', lastMatch.winner.oldRating,
        'new rating: ', lastMatch.winner.newRating)
      console.warn('loser:', lastMatch.loser.name,
        'old rating:', lastMatch.loser.oldRating,
        'new rating: ', lastMatch.loser.newRating)
      this._navigateBack()
    })
  }

  _handleCancel() {
    this._navigateBack()
  }

}

export default Game
