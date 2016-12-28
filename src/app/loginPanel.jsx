import React from 'react'

import Api from './api/'
import Config from './config'
import FacebookLoginControl from './facebookLoginControl'
import Panel from './panel'
import Session from './session'
import state from './state/'

class LoginPanel extends React.Component {

  render() {
    if (Config.EMAIL_ACCOUNTS) {
      return (
        <Panel>
          <div className="panel-section">
            LOGIN WITH FACEBOOK
            <FacebookLoginControl />
          </div>
          <div className="panel-section">
            LOGIN WITH EMAIL
            <div className="vertical-form">
              <label>
                Email
                <input className="login-email" type="email" ref={(el) => this._emailInput = el} />
              </label>
              <label>
                Password
                <input className="login-password" type="password" ref={(el) => this._passwordInput = el} />
              </label>
              <span>
                <button onClick={this._handleLogin.bind(this)}>
                  LOGIN
                </button>
              </span>
            </div>
          </div>
          <span>
            <button onClick={this._handleCancel.bind(this)}>
              CANCEL
            </button>
          </span>
        </Panel>
      )
    } else {
      return (
        <Panel>
          LOGIN PAGE DISABLED. Use Facebook Login button.
          <span>
            <button onClick={this._handleCancel.bind(this)}>
              CANCEL
            </button>
          </span>
        </Panel>
      )
    }
  }

  _handleLogin() {
    const email     = this._emailInput.value
    const password  = this._passwordInput.value
    Api.loginUser(email, password).then((sessionData) => {
      Session.set(sessionData)
      window.location.reload(true)
    })
  }

  _handleCancel() {
    state.setPage('leaderboard')
  }

}

export default LoginPanel
