import React from 'react'

import Api from './api/'
import FacebookLoginControl from './facebookLoginControl'
import Session from './session'
import state from './state/'
import TitleBar from './titleBar'

class LoginPage extends React.Component {

  render() {
    return (
      <section>
        <header>
          <TitleBar />
        </header>
        <div className="panel">
          <div className="panel-section">
            LOGIN WITH FACEBOOK
            <FacebookLoginControl />
          </div>
          <div className="panel-section">
            LOGIN WITH EMAIL
            <div className="vertical-form">
              <label>
                Email
                <input className="login-email" />
              </label>
              <label>
                Password
                <input className="login-password" />
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
        </div>
      </section>
    )
  }

  _handleLogin() {
    const email     = document.querySelector('input.login-email').value
    const password  = document.querySelector('input.login-password').value
    Api.loginUser(email, password).then((sessionData) => {
      Session.set(sessionData)
      window.location.reload(true)
    })
  }

  _handleCancel() {
    state.page = 'logo'
  }

}

export default LoginPage
