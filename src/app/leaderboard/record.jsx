import React from 'react'

import createClassNameString from '../utils/createClassNameString'

const classes = (pending) => createClassNameString('win-loss-record', pending ? 'subtle' : null)

const Record = ({ user }) => (
  <span className={ classes(user.num_pending) }>
    {user.num_matches ? `${user.num_wins}-${user.num_losses}` : ''}
    {user.num_pending ? '*' : ''}
  </span>
)

export default Record
