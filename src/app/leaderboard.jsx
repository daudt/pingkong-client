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
    Api.getLeaderboard()
  }

  render() {
    if (state.lastWinner) {
      console.warn('winner:', state.lastWinner.name,
        'old rating:', state.lastWinner.oldRating,
        'new rating: ', state.lastWinner.newRating)
    }
    if (state.lastLoser) {
      console.warn('loser:', state.lastLoser.name,
        'old rating:', state.lastLoser.oldRating,
        'new rating: ', state.lastLoser.newRating)
    }

    const leaderboard = state.leaderboard.map((user, index) => {
      const isExpandedUser = (this._expandedUser === user)

      return (
        <div
          key={user.id}
          className={state.selectedPlayers.includes(user) ? 'user selected': 'user'}
          onClick={this._handleClick.bind(this, user)}
        >
          <div>
            <span>{index + 1}</span>
            <img className="avatar" src={user.image} />
            <span className="userName">{user.nickname}<div className="subtle">{user.name}</div></span>
            <span>{user.rating}</span>
            <span onClick={this._handleStatsClick.bind(this, user)}>
              {isExpandedUser ? String.fromCharCode('9650') : String.fromCharCode('9660')}
            </span>
          </div>
          {isExpandedUser ? <ExpandedInfo user={user} />: null }
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
      state.selectedPlayers = state.selectedPlayers.filter((player) => (player !== user))
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
