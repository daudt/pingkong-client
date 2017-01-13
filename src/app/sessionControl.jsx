import {observer} from 'mobx-react'
import React from 'react'

import Api from './api/'
import Config from './config'
import FacebookLoginControl from './facebookLoginControl'
import Session from './session'
import state from './state'

@observer
class SessionControl extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this._fetchMe()
  }

  _openLogin() {
    state.setPage('login')
  }

  _openRegister() {
    state.setPage('register')
  }

  _logout() {
    Session.clear()
    window.location.reload(true)
  }

  _fetchMe() {
    Api.fetchMe()
      .then((result) => {
        if (!Config.EMAIL_ACCOUNTS && result.data.provider === 'email') {
          // email logins not enabled, log out this email session now:
          this._logout()
        } else {
          state.me = result.data
        }
      })
      .catch(() => {
        // not logged in
        if (Session.isActive()) {
          // session thought it was active, but it must be invalid now, panic
          this._logout()
        }
      })
  }

  _getMeElement() {
    if (state.me) {
      return (
        <span>
          Logged in:
          <button onClick={this._clickProfile.bind(this)}>
            {state.me.nickname || state.me.name}
          </button>
        </span>
      )
    }
  }

  _clickProfile() {
    state.setPage('profile')
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
      if (state.currentPage.name === 'register' || state.currentPage.name === 'login') {
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
