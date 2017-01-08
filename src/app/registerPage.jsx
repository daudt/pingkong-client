import React from 'react'

import MainContent from './mainContent'
import RegisterPanel from './registerPanel'
import TitleBar from './titleBar'

class RegisterPage extends React.Component {

  render() {
    return (
      <section>
        <TitleBar />
        <MainContent>
          <RegisterPanel />
        </MainContent>
      </section>
    )
  }

}

export default RegisterPage
