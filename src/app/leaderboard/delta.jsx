import React from 'react'

const Delta = ({ user, userDelta }) => {
  if (!userDelta) {
    return null
  }

  const ratingDelta   = userDelta.delta
  const className     = (ratingDelta > 0) ? 'increase' : 'decrease'
  const prefix        = (ratingDelta > 0) ? '+' : '-'
  const displayValue  = `${prefix}${Math.abs(ratingDelta)}`

  return (
    <span className={className}>{displayValue}</span>
  )
}

export default Delta
