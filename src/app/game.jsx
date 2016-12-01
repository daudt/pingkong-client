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
          <p>{state.selectedPlayers[0].name}</p>
          <h3>VS.</h3>
          <p>{state.selectedPlayers[1].name}</p>
        </div>
        <button>SAVE GAME</button>
      </section>
    )
  }
}

export default Game
