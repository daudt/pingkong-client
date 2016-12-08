import React from 'react'

class TitleBar extends React.Component {

  render() {
    return (
      <span className="wideLogo">
        <img src="/app/king-pong-logo-wide.png" className="logo" />
        <span className="emoji">
          🏓
        </span>
      </span>
    )
  }

}

export default TitleBar
