import React from 'react'

import Api from './api/'
import state from './state/'
import TitleBar from './titleBar'

const OAUTH_REDIR_URL = 'https://www.kingofpong.com/oauth-done.html'

class LoginPage extends React.Component {

  render() {
    return (
      <section>
        <header>
          <TitleBar />
          <div className="login-option">
            <button onClick={this._handleFacebookLogin.bind(this)}>
              LOGIN WITH FACEBOOK
            </button>
          </div>
          <div>
            OR
          </div>
          <div className="login-option">
            <div>
              <label>
                Email
              <input className="loginEmail" />
              </label>
              <label>
                Password
              <input className="loginPassword" />
              </label>
              <button onClick={this._handleEmailLogin.bind(this)}>
                LOGIN WITH EMAIL
              </button>
            </div>
          </div>
          <button onClick={this._handleCancel.bind(this)}>
            CANCEL
          </button>
        </header>
      </section>
    )
  }

  _handleEmailLogin() {
    const email = document.querySelector('.loginEmail').value
    const password = document.querySelector('.loginPassword').value
    Api.loginUser(email, password).then(() => {
      state.page='leaderboard'
    })
  }

  _handleFacebookLogin() {
    const url = `${Api.getBaseUrl()}/auth/facebook?auth_origin_url=${encodeURIComponent(OAUTH_REDIR_URL)}`
    window.location.href = url
  }

  _handleCancel() {
    state.page = 'logo'
  }

}

export default LoginPage
