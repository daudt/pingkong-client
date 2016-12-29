import React from 'react'

export default function getUserNameElement(user) {
  return (
    <span className="userName">
      {user.nickname || user.name}
      {user.nickname && user.name && user.nickname !== user.name ? <div className="subtle">{user.name}</div> : null}
    </span>
  )
}
