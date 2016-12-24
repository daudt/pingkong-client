import React from 'react'

import LoginPanel from './loginPanel'
import TitleBar from './titleBar'

class LoginPage extends React.Component {

  render() {
    return (
      <section>
        <header>
          <TitleBar />
        </header>
        <LoginPanel />
      </section>
    )
  }

}

export default LoginPage
