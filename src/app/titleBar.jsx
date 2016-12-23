import React from 'react'

import SessionControl from './sessionControl'

class TitleBar extends React.Component {

  render() {
    return (
      <span className="wideLogo">
        <img src="/app/king-pong-logo-wide.png" className="logo" />
        <span className="emoji">
          🏓
        </span>
        <SessionControl />
      </span>
    )
  }

}

export default TitleBar
