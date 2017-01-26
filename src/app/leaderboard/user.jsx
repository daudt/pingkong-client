import React from 'react'

import Avatar from './avatar'
import Delta from './delta'
import Rating from './rating'
import Record from './record'
import UserName from './userName'

import createClassNameString from '../createClassNameString'

const classes = (user, me, canChallengeOpponent) => createClassNameString(
  'user',
  canChallengeOpponent ? 'active' : null,
  (me && user.id === me.id) ? 'selected' : null
)

const User = ({ user, index, me, deltas, isExpandedUser, handleClick }) => {
  // check if logged in AND not selecting self
  const canChallengeOpponent = !!me && user.id !== me.id
  const clickHandler = canChallengeOpponent && handleClick

  return (
    <div className={ classes(user, me, canChallengeOpponent) } onClick={ clickHandler } >
      <div>
        <span>{index + 1}</span>
        <Avatar image={ user.image } />
        <UserName user={ user } />
        <Delta user={ user } userDelta={ deltas.find((delta) => delta.userID === userID) } />
        <Rating user={ user } />
        <Record user={ user } />
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

export default User
