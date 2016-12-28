import {observable} from 'mobx'
import {observer} from 'mobx-react'
import React from 'react'

import Api from './api/'
import ExpandedInfo from './expandedInfo'
import Panel from './panel'
import state from './state/'
import TitleBar from './titleBar'

const CACHED_RATINGS_KEY = 'cachedRatings'

@observer
class Leaderboard extends React.Component {
  @observable _expandedUser

  constructor(props) {
    super(props)
    this._leaderboardRendered = false
    this.state = {
      deltas: [],
      selectedPlayers: []
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
    // const canChallengeOpponent = state.me && user.id !== state.me.id

    const canChallengeOpponent = !!state.me // && user.id !== state.me.id

    const className = (() => {
      const classNames = [ 'user' ]
      if (canChallengeOpponent) {
        classNames.push('active')
      }
      if (this.state.selectedPlayers.includes(user)) {
        classNames.push('selected')
      }
      return classNames.join(' ')
    })()

    const clickHandler = canChallengeOpponent && this._handleClick.bind(this, user)

    return (
      <div
      key={user.id}
      className={className}
      onClick={clickHandler}
      >
        <div>
          <span>{index + 1}</span>
          <img className="avatar" src={user.image} />
          <span className="userName">
            {user.nickname}
            <div className="subtle">{user.name}</div>
          </span>
          {getDeltaElement(user.id)}
          <span className="rating">{user.rating}</span>
          <span className="arrow" onClick={this._handleStatsClick.bind(this, user)}>
            {isExpandedUser ? String.fromCharCode('9650') : String.fromCharCode('9660')}
          </span>
        </div>
        {isExpandedUser ? <ExpandedInfo user={user} /> : null}
      </div>
    )
  }

  // {state.winner && state.loser && state.winner.id !== user.id && state.loser.id !== user.id ? <span></span> : null}


  render() {
    const getContent = () => {
      if (state.leaderboard.length) {   // leaderboard has loaded
        return (
          <Panel className='leaderboard'>
            <h3>
              LEADERBOARD
            </h3>
            <div className="panel-subtitle">
              Select opponents to record a game.
            </div>
            <div className="panel-section">
              {state.leaderboard.map(this._getUserElement.bind(this))}
            </div>
          </Panel>
        )
      }
    }

    return (
      <section>
        <header>
          <TitleBar />
        </header>
        {getContent()}
      </section>
    )
  }

  _handleClick(user, evt) {
    if (this.state.selectedPlayers.includes(user)) {
      this.state.selectedPlayers = this.state.selectedPlayers.filter((player) => player !== user)
    } else {
      this.state.selectedPlayers.push(user)
    }
    this.setState({ selectedPlayers: this.state.selectedPlayers })
    if (this.state.selectedPlayers.length === 2) {
      state.setPage('game', { user1: this.state.selectedPlayers[0], user2: this.state.selectedPlayers[1] })
    }
  }

  _handleStatsClick(user, evt) {
    evt.stopPropagation()
    this._expandedUser = (this._expandedUser !== user) ? user : null
  }
}

export default Leaderboard
