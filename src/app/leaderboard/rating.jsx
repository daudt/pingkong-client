import React from 'react'

import createClassNameString from '../utils/createClassNameString'

const classes = (pending) => createClassNameString('rating', pending ? 'subtle' : null)

const Rating = ({ user }) => (
  <span className={ classes(user.num_pending) }>
    {user.num_matches ? user.rating : ''}
    {user.num_pending ? '*' : ''}
  </span>
)

export default Rating
