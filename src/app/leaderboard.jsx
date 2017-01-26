import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import Api from './api/'
import MainContent from './mainContent'
import state from './state/'
import TitleBar from './titleBar'

import LeaderboardContent from './leaderboard/leaderboardContent'

import navigator from './utils/navigator'
import ratingsCache from './utils/ratingsCache'

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
        const newDeltas = ratingsCache.getUserDeltas(rankedUsers)
        if (newDeltas.length) {
          stateUpdates.deltas = newDeltas
        }
        ratingsCache.update(rankedUsers)
        this.setState(stateUpdates)
      })
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
            handleClick={ handleUserClick.bind(null) }
          />
        </MainContent>
      </section>
    )
  }

  _handleStatsClick(user, evt) {
    evt.stopPropagation()
    this._expandedUser = (this._expandedUser !== user) ? user : null
  }
}

function handleUserClick(user, evt) {
  return function(evt) {
    if (user.id !== state.me.id) {
      navigator.openGamePage(user)
    }
  }
}

export default Leaderboard
