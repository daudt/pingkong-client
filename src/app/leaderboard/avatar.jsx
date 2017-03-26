import React from 'react'

const Avatar = ({ image }) => (
  image ? <img className="avatar" src={image} /> : <div className="avatar" />
)

export default Avatar
