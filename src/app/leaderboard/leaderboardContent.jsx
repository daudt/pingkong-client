import React from 'react'

import HistoryPanel from '../historyPanel'
import Panel from '../panel'

import Header from './header'
import User from './user'

const LeaderboardContent = ({ rankedUsers, me, deltas, expandedUser, handleClick }) => {
  if (!rankedUsers) {
    return null
  }

  const subTitleElement = me ? <div className="panel-subtitle">Select your opponent to record a match.</div> : <div className="panel-subtitle warning">Login to record a match.</div>
  const pendingMemo = rankedUsers.some((user) => !!user.num_pending) ? <div className="panel-subtitle">* Has unconfirmed matches</div> : null
  const makeUser = (user, index) => (
    <User
      key={ user.id }
      user={ user }
      index={ index }
      me={ me }
      deltas={ deltas }
      isExpandedUser={ expandedUser === user }
      handleClick={ handleClick(user) }
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
          {rankedUsers.map( makeUser )}
        </div>
        {pendingMemo}
      </Panel>
      <HistoryPanel />
    </span>
  )
}

export default LeaderboardContent
