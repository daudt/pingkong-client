import {observable} from 'mobx'
import {observer} from 'mobx-react'
import React from 'react'

import Api from './api/'
import ExpandedInfo from './expandedInfo'
import state from './state/'

@observer
class Leaderboard extends React.Component {
  @observable _expandedUser

  componentWillMount() {
    Api.getRankings()
  }

  render() {
    const leaderboard = state.leaderboard.map((user, index) => {
      const isExpandedUser = (this._expandedUser === user)

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
            <button onClick={this._handleStatsClick.bind(this, user)}>
              {isExpandedUser ? 'Close Stats' : 'Open Stats'}
            </button>
          </div>
          {isExpandedUser ? <ExpandedInfo />: null }
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

  _handleStatsClick(user, evt) {
    evt.stopPropagation()
    this._expandedUser = (this._expandedUser !== user) ? user : null
  }
}

export default Leaderboard
