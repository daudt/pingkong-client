import {observable} from 'mobx'
import {observer} from 'mobx-react'
import React from 'react'

import Api from './api/'
import ExpandedInfo from './expandedInfo'
import getUserNameElement from './getUserNameElement'
import Panel from './panel'
import state from './state/'
import TitleBar from './titleBar'
import Toast from './toast'

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

  _getUserElement(user, index) {
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

    // check if logged in AND not selecting self
    const canChallengeOpponent = !!state.me && user.id !== state.me.id

    const className = (() => {
      const classNames = [ 'user' ]
      if (canChallengeOpponent) {
        classNames.push('active')
      }
      if (state.me && user.id === state.me.id) {
        classNames.push('selected')
      }
      return classNames.join(' ')
    })()

    const clickHandler = canChallengeOpponent && this._handleClick.bind(this, user)

    const avatarElement = user.image ? <img className="avatar" src={user.image} /> : <div className="avatar" />

    const getRecordElement = (user) => {
      return (
        <span className="win-loss-record">
        {user.num_wins}-{user.num_losses}
        </span>
      )
    }

    return (
      <div
      key={user.id}
      className={className}
      onClick={clickHandler}
      >
        <div>
          <span>{index + 1}</span>
          {avatarElement}
          {getUserNameElement(user)}
          {getDeltaElement(user.id)}
          <span className="rating">{user.rating}</span>
          {getRecordElement(user)}
          {/*
          <span className="arrow" onClick={this._handleStatsClick.bind(this, user)}>
            {isExpandedUser ? String.fromCharCode('9650') : String.fromCharCode('9660')}
          </span>
          */}
        </div>
        {/*
        {isExpandedUser ? <ExpandedInfo user={user} /> : null}
        */}
      </div>
    )
  }

  _getHeaderElement() {
    return (
      <div className="user">
        <div>
          <span>RANK</span>
          <span></span>
          <span>RATING</span>
          <span className="win-loss-record">W-L</span>
        </div>
      </div>
    )
  }

  _getLeaderboardContent() {
    if (this.state.rankedUsers) {   // leaderboard has loaded
      const subTitleElement = state.me ? <div className="panel-subtitle">Select your opponent to record a match.</div> : <div className="panel-subtitle warning">Login to record a game.</div>
      return (
        <Panel className='leaderboard'>
          <h3>
            LEADERBOARD
          </h3>
          {subTitleElement}
          <div className="panel-section">
            {this._getHeaderElement()}
            {this.state.rankedUsers.map(this._getUserElement.bind(this))}
          </div>
        </Panel>
      )
    }
  }

  render() {
    return (
      <section>
        <header>
          <TitleBar />
        </header>
        {this._getLeaderboardContent()}
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
