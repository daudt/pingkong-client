import {observable} from 'mobx'
import {observer} from 'mobx-react'
import React from 'react'

import Api from './api/'
import ExpandedInfo from './expandedInfo'
import state from './state/'

const CACHED_RATINGS_KEY = 'cachedRatings'

@observer
class Leaderboard extends React.Component {
  @observable _expandedUser

  constructor(props) {
    super(props)
    this._leaderboardRendered = false
    this.state = {
      deltas: []
    }
  }

  componentWillMount() {
    Api.getLeaderboard()
  }

  componentDidUpdate() {
    if (!this._leaderboardRendered && state.leaderboard) {
      this._renderDeltas()
      this._updateCachedRatings()
      this._leaderboardRendered = true
    }
  }

  _renderDeltas() {
    const newDeltas = this._getUserDeltas() || []
    console.log('set state new deltas', newDeltas)
    if (newDeltas.length) {
      this.setState({ deltas: newDeltas })
    }
  }

  _getUserDeltas() {
    if (!state.leaderboard) {
      return
    }
    const cachedRatings = this._getCachedRatings()
    if (!cachedRatings) {
      return
    }
    return cachedRatings
      .map((cachedRating) => {
        const leaderboardUser = state.leaderboard.find((user) => user.id === cachedRating.userID)
        return leaderboardUser && (leaderboardUser.rating !== cachedRating.rating) ? { userID: cachedRating.userID, delta: leaderboardUser.rating - cachedRating.rating } : null
      })
      .filter(Boolean)
  }

  _getCachedRatings() {
    const ratingsStr = window.localStorage.getItem(CACHED_RATINGS_KEY)
    if (ratingsStr) {
      return JSON.parse(ratingsStr)
    }
  }

  _updateCachedRatings() {
    const ratings = state.leaderboard.map((user) => {
      return {
        userID: user.id,
        rating: user.rating
      }
    })
    window.localStorage.setItem(CACHED_RATINGS_KEY, JSON.stringify(ratings))
  }

  _getLeaderboardElement() {
    return state.leaderboard.map((user, index) => {
      const isExpandedUser = (this._expandedUser === user)

      const getDeltaElement = (userID) => {
        const userDelta = this.state.deltas.find((delta) => delta.userID === userID)
        if (userDelta) {
          const ratingDelta   = userDelta.delta
          const className     = (ratingDelta > 0) ? 'increase' : 'decrease'
          const prefix        = (ratingDelta > 0) ? '+' : '-'
          const displayValue  = `${prefix}${Math.abs(ratingDelta)}`
          return (
            <span className={className}>{displayValue}</span>
          )
        }
      }

      return (
        <div
        key={user.id}
        className={state.selectedPlayers.includes(user) ? 'user selected': 'user'}
        onClick={this._handleClick.bind(this, user)}
        >
          <div>
            <span>{index + 1}</span>
            <img className="avatar" src={user.image} />
            <span className="userName">
              {user.nickname}
              <div className="subtle">{user.name}</div>
            </span>
            {state.winner && state.loser && state.winner.id !== user.id && state.loser.id !== user.id ? <span></span> : null}
            {getDeltaElement(user.id)}
            <span className="rating">{user.rating}</span>
            <span className="arrow" onClick={this._handleStatsClick.bind(this, user)}>
              {isExpandedUser ? String.fromCharCode('9650') : String.fromCharCode('9660')}
            </span>
          </div>
          {isExpandedUser ? <ExpandedInfo user={user} /> : null}
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
    } else {
      state.selectedPlayers.push(user)
    }
  }

  _handleStatsClick(user, evt) {
    evt.stopPropagation()
    this._expandedUser = (this._expandedUser !== user) ? user : null
  }
}

export default Leaderboard
