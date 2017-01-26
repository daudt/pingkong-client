import {observable} from 'mobx'
import {observer} from 'mobx-react'
import React from 'react'

import Api from './api/'
import ExpandedInfo from './expandedInfo'
import HistoryPanel from './historyPanel'
import MainContent from './mainContent'
import Panel from './panel'
import state from './state/'
import TitleBar from './titleBar'
import Toast from './toast'

import Header from './leaderboard/header'
import User from './leaderboard/user'

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

  _getLeaderboardContent() {
    if (this.state.rankedUsers) {   // leaderboard has loaded
      const subTitleElement = state.me ? <div className="panel-subtitle">Select your opponent to record a match.</div> : <div className="panel-subtitle warning">Login to record a match.</div>
      const pendingMemo = this.state.rankedUsers.some((user) => !!user.num_pending) ? <div className="panel-subtitle">* Has unconfirmed matches</div> : null
      const makeUser = (user, index) => (
        <User
          key={ user.id }
          user={ user }
          index={ index }
          me={ state.me }
          deltas={ this.state.deltas }
          isExpandedUser={ this._expandedUser === user }
          handleClick={ this._handleClick.bind(this, user) }
        />
      )

      return (
        <span>
          <Panel className='leaderboard'>
            <h3>
              LEADERBOARD
            </h3>
            {subTitleElement}
            <div className="panel-section">
              <Header />
              {this.state.rankedUsers.map( makeUser )}
            </div>
            {pendingMemo}
          </Panel>
          <HistoryPanel />
        </span>
      )
    }
  }

  render() {
    return (
      <section>
        <TitleBar />
        <MainContent>
          {this._getLeaderboardContent()}
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
