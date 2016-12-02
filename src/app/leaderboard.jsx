import {observer} from 'mobx-react'
import React from 'react'

import Api from './api/'
import ExpandedInfo from './expandedInfo'
import state from './state/'

@observer
class Leaderboard extends React.Component {
  constructor() {
    super()

    Api.getData()

    this.state = {
      expandedPlayer: null
    }
  }

  render() {
    const leaderboard = state.leaderboard.map((user, index) => {
      return (
        <div className='user' key={user.email}>
          <div
            onClick={this._handleClick.bind(this, user)}
            className={state.selectedPlayers.includes(user) ? 'selected': null}
          >
            <span>{index + 1}</span>
            <img src={user.image} />
            <span>{user.rating}</span>
            <span>{user.name} ({user.nickname})</span>
            <button onClick={this._openStats.bind(this, user)}>Open Stats</button>
          </div>
          {this.state.expandedPlayer === user ? <ExpandedInfo />: null }
        </div>
      )
    })

    return (
      <section id='leaderboard'>
        {leaderboard}
      </section>
    )
  }

  _handleClick(user, evt) {
    if (state.selectedPlayers.includes(user)) {
      state.selectedPlayers.pop(user)
    }
    else {
      state.selectedPlayers.push(user)
    }
  }

  _openStats(user, evt) {
    console.warn('_openStats', user.name)
    this.setState({
      expandedPlayer: user
    })
    evt.stopPropagation()
  }
}

export default Leaderboard
