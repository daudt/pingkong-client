import React from 'react'

import SessionControl from './sessionControl'

class TitleBar extends React.Component {

  render() {
    return (
      <span>
        <img src="/app/king-pong-logo-wide.png" className="logo" />
        <SessionControl />
      </span>
    )
  }

}

export default TitleBar
