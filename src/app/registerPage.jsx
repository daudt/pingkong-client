import React from 'react'

import Api from './api/'
import FacebookLoginControl from './facebookLoginControl'
import state from './state/'
import TitleBar from './titleBar'

class RegisterPage extends React.Component {

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
            REGISTER WITH EMAIL
            <div className="vertical-form">
              <label>
                Real Name
                <input className="name" />
              </label>
              <label>
                Nickname
                <input className="nickname" />
              </label>
              <label>
                Email
                <input className="email" />
              </label>
              <label>
                Password
                <input className="password" type="password" />
              </label>
              <span>
                <button onClick={this._handleRegister.bind(this)}>
                  REGISTER
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

  _handleRegister() {
    const email     = document.querySelector('input.email').value
    const password  = document.querySelector('input.password').value
    const name      = document.querySelector('input.name').value
    const nickname  = document.querySelector('input.nickname').value
    Api.createUser(email, password, name, nickname).then(() => {
      state.page = 'leaderboard'
    })
  }

  _handleCancel() {
    state.page = 'logo'
  }

}

export default RegisterPage
