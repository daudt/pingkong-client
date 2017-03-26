import React from 'react'

const UserName = ({ user }) => (
  <span className="user-name">
    {user.nickname || user.name}
    {user.nickname && user.name && user.nickname !== user.name ? <div className="subtle">{user.name}</div> : null}
  </span>
)

export default UserName
