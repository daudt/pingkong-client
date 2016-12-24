import React from 'react'

import RegisterPanel from './registerPanel'
import TitleBar from './titleBar'

class RegisterPage extends React.Component {

  render() {
    return (
      <section>
        <header>
          <TitleBar />
        </header>
        <RegisterPanel />
      </section>
    )
  }

}

export default RegisterPage
