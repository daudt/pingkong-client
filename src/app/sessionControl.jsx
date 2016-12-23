import React from 'react'

import Api from './Api'
import Session from './session'
import state from './state'

class SessionControl extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      me: null
    }
  }

  _openLogin() {
    state.page = 'login'
  }

  _handleLogout() {
    Session.clear()
    window.location.reload(true)
  }

  _fetchMe() {
    Api.fetchMe()
  }

  _getMeElement() {
    if (this.state.me) {
      return (
        <span>
        </span>
      )
    } else {
      this._fetchMe()
      return (
        <span>
        </span>
      )
    }
  }

  render() {
    if (Session.isActive()) {
      return (
        <span>
          {this._getMeElement()}
          <button onClick={this._handleLogout.bind(this)}>
            LOGOUT
          </button>
        </span>
      )
    } else {
      return (
        <button onClick={this._openLogin.bind(this)}>
          LOGIN
        </button>
      )
    }
  }

}

export default SessionControl
