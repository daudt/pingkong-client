import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import Api from './api/'
import MainContent from './mainContent'
import state from './state/'
import TitleBar from './titleBar'

import LeaderboardContent from './leaderboard/leaderboardContent'

const CACHED_RATINGS_KEY = 'cachedRatings'

@observer
class Leaderboard extends React.Component {
  @observable _expandedUser

  constructor(props) {
    super(props)
    this.state = {
      rankedUsers:      null,
      deltas:           [],
      selectedPlayers:  []
    }
  }

  componentWillMount() {
    Api.getRankedUsers()
      .then((rankedUsers) => {
        state.leader = rankedUsers[0]
        const stateUpdates = {
          rankedUsers
        }
        const newDeltas = this._getUserDeltas(rankedUsers) || []
        if (newDeltas.length) {
          stateUpdates.deltas = newDeltas
        }
        this._updateCachedRatings(rankedUsers)
        this.setState(stateUpdates)
      })
  }

  _getUserDeltas(rankedUsers) {
    const cachedRatings = this._getCachedRatings()
    if (!cachedRatings) {
      return
    }
    return cachedRatings
      .map((cachedRating) => {
        const leaderboardUser = rankedUsers.find((user) => user.id === cachedRating.userID)
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

  _updateCachedRatings(rankedUsers) {
    const ratings = rankedUsers.map((user) => {
      return {
        userID: user.id,
        rating: user.rating
      }
    })
    window.localStorage.setItem(CACHED_RATINGS_KEY, JSON.stringify(ratings))
  }

  render() {
    return (
      <section>
        <TitleBar />
        <MainContent>
          <LeaderboardContent
            rankedUsers={ this.state.rankedUsers }
            me={ state.me }
            deltas={ this.state.deltas }
            expandedUser={ this._expandedUser }
            handleClick={ this._handleClick.bind(this) }
          />
        </MainContent>
      </section>
    )
  }

  _handleClick(user, evt) {
    if (user.id !== state.me.id) {
      state.setPage('game', { you: state.me, them: user })
    }
  }

  _handleStatsClick(user, evt) {
    evt.stopPropagation()
    this._expandedUser = (this._expandedUser !== user) ? user : null
  }
}

export default Leaderboard
