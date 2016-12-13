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
    // Api.createUser()
    // Api.loginUser()
    // Api.getUsers()
  }

  _getLeaderboardElement() {
    return state.leaderboard.map((user, index) => {
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
        {state.winner && state.loser && state.winner.id !== user.id && state.loser.id !== user.id ? <span></span> : null}
        {state.winner && state.winner.id === user.id ? <span className="increase">+{state.winner.diff}</span> : null}
        {state.loser && state.loser.id === user.id ? <span className="decrease">-{state.loser.diff}</span> : null}
        <span className="rating">{user.rating}</span>
        <span className="arrow" onClick={this._handleStatsClick.bind(this, user)}>
        {isExpandedUser ? String.fromCharCode('9650') : String.fromCharCode('9660')}
        </span>
        </div>
        {isExpandedUser ? <ExpandedInfo user={user} />: null }
        </div>
      )
    })
  }

  _getBlankLeaderboardElement() {
    return (
      <section>
        <h2>No games recorded yet! Play someone!</h2>
      </section>
    )
  }

  render() {

    // const leaderboard = state.users.map((user, index) => {
    //   return (
    //     <div key={index}>
    //       {user.name}
    //     </div>
    //   )
    // })

    const leaderboard = state.leaderboard.length ? this._getLeaderboardElement() : this._getBlankLeaderboardElement()

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
