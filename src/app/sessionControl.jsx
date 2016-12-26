import React from 'react'

import Api from './api/'
import Config from './config'
import FacebookLoginControl from './facebookLoginControl'
import Session from './session'
import state from './state'

class SessionControl extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      // TODO: Store me once in external state dependency rather than refetching for every instance of SessionControl
      me: null
    }
  }

  componentWillMount() {
    this._fetchMe()
  }

  _openLogin() {
    state.page = 'login'
  }

  _openRegister() {
    state.page = 'register'
  }

  _logout() {
    Session.clear()
    window.location.reload(true)
  }

  _fetchMe() {
    Api.fetchMe()
      .then((result) => {
        if (!Config.EMAIL_ACCOUNTS && result.data.provider && result.data.provider === 'email') {
          // email logins not enabled, log out this email session now:
          this._logout()
        } else {
          this.setState({ me: result.data })
        }
      })
      .catch(() => {
        // not logged in
      })
  }

  _getMeElement() {
    if (this.state.me) {
      return (
        <div>
          Welcome, {this.state.me.nickname || this.state.me.name}
        </div>
      )
    }
  }

  render() {
    if (Session.isActive()) {
      return (
        <span>
          {this._getMeElement()}
          <button onClick={this._logout.bind(this)}>
            LOGOUT
          </button>
        </span>
      )
    } else {
      if (state.page === 'register' || state.page === 'login') {
        return (
          <span></span>
        )
      } else {
        if (Config.EMAIL_ACCOUNTS) {
          return (
            <span>
              <button onClick={this._openLogin.bind(this)}>
                LOGIN
              </button>
              <button onClick={this._openRegister.bind(this)}>
                REGISTER
              </button>
            </span>
          )
        } else {
          return (
            <FacebookLoginControl />
          )
        }
      }
    }
  }

}

export default SessionControl
