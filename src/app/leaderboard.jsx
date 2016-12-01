import {observer} from 'mobx-react'
import React from 'react'

import Api from './api/'
import state from './state/'

@observer
class Leaderboard extends React.Component {
  constructor() {
    super()

    Api.getData()
  }

  render() {
    const leaderboard = state.leaderboard.map((item, index) => {
      return (
        <div
          key={item.email}
          onClick={this._handleClick.bind(this, item)}
          className={state.selectedPlayers.includes(item) ? 'selected': null}
        >
          <span>{index + 1}</span>
          <img src={item.image} />
          <span>{item.rating}</span>
          <span>{item.name} ({item.nickname})</span>
        </div>
      )
    })

    return (
      <section id='leaderboard'>
        {leaderboard}
      </section>
    )
  }

  _handleClick(item, evt) {
    if (state.selectedPlayers.includes(item)) {
      state.selectedPlayers.pop(item)
    }
    else {
      state.selectedPlayers.push(item)
    }
  }
}

export default Leaderboard
