import React from 'react'

import Api from './api/'
import state from './state/'
import TitleBar from './titleBar'

class LoginPage extends React.Component {

  render() {
    return (
      <section>
        <header>
          <TitleBar />
          <div>
            <label>
              Email
            <input className="loginEmail" />
            </label>
            <label>
              Password
            <input className="loginPassword" />
            </label>
            <button onClick={this._handleClick.bind(this)}>
              LOGIN
            </button>
            <button onClick={this._handleCancel.bind(this)}>
              CANCEL
            </button>
          </div>
        </header>
      </section>
    )
  }

  _handleClick() {
    const email = document.querySelector('.loginEmail').value
    const password = document.querySelector('.loginPassword').value
    Api.loginUser(email, password).then(() => {
      state.page='leaderboard'
    })
  }

  _handleCancel() {
    state.page = 'logo'
  }

}

export default LoginPage
