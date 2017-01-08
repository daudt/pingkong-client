import React from 'react'

import LoginPanel from './loginPanel'
import MainContent from './mainContent'
import TitleBar from './titleBar'

class LoginPage extends React.Component {

  render() {
    return (
      <section>
        <TitleBar />
        <MainContent>
          <LoginPanel />
        </MainContent>
      </section>
    )
  }

}

export default LoginPage
