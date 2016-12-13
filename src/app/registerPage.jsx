import React from 'react'

import Api from './api/'
import state from './state/'

class RegisterPage extends React.Component {

  render() {
    return (
      <section>
        <label>
          Email
          <input value='scuba@daudt.com'/>
        </label>
        <label>
          Password
          <input value='aaa12345'/>
        </label>
        <button onClick={this._handleClick.bind(this)}>LOGIN</button>
      </section>
    )
  }

  _handleClick() {
    Api.loginUser(document.querySelector('input').value, document.querySelector('label:nth-child(2) input').value).then(() => {
      state.page='logo'
    })
  }

}

export default RegisterPage
