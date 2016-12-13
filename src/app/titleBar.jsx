import React from 'react'

import state from './state'

class TitleBar extends React.Component {

  _getCurrentUserControl() {
    // login control or profile stuff
    if (state.user) {
      // TODO: Show 'logged in as ____' type of thing
    } else if (state.page !== 'login') {
      return (
        <button onClick={this._openLogin.bind(this)}>
          LOGIN
        </button>
      )
    }
  }

  _openLogin() {
    state.page = 'login'
  }

  render() {
    return (
      <span className="wideLogo">
        <img src="/app/king-pong-logo-wide.png" className="logo" />
        <span className="emoji">
          🏓
        </span>
        {this._getCurrentUserControl()}
      </span>
    )
  }

}

export default TitleBar
