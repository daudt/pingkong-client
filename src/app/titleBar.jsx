import React from 'react'

import SessionControl from './sessionControl'

class TitleBar extends React.Component {

  render() {
    return (
      <div className="flex-column">
        <img src="/app/king-pong-logo-wide.png" className="logo" />
        <SessionControl />
      </div>
    )
  }

}

export default TitleBar
