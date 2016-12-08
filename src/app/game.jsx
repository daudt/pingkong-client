import { action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import Api from './api/'
import state from './state/'
import TitleBar from './titleBar'

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
    const createPlayerSelector = (index) => {
      return (
        <div
          onClick={this._handleClick.bind(this, state.selectedPlayers[index])}
          className={this._getClass(index)}
          >
          <img className='avatar' src={state.selectedPlayers[index].image} />
          <span className="userName">
            {state.selectedPlayers[index].nickname}
            <div className="subtle">{state.selectedPlayers[index].name}</div>
          </span>
          <h1>{this._getLabel(index)}</h1>
        </div>
      )
    }
    return (
      <section id="game">
        <header>
          <TitleBar />
          <span>
            {state.winner ? (<button onClick={this._handleRecordMatch.bind(this)}>RECORD MATCH</button>) : 'Who won?'}
            <button onClick={this._handleCancel.bind(this)}>CANCEL</button>
          </span>
        </header>
        <div>
          {createPlayerSelector(0)}
          <div className="spacer" />
          {createPlayerSelector(1)}
        </div>
      </section>
    )
  }

  _handleClick(winner) {
    state.winner = winner
  }

  @action
  _navigateBack() {
    // state.winner = null
    state.selectedPlayers = []
    state.page = 'logo'
  }

  _handleRecordMatch() {
    const loser = (state.selectedPlayers[0] !== state.winner) ?
      state.selectedPlayers[0] : state.selectedPlayers[1]

    Api.addMatch(state.winner, loser)
    this._navigateBack()
  }

  _handleCancel() {
    this._navigateBack()
  }

}

export default Game
