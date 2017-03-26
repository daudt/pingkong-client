import React from 'react'

import LoginPanel from './loginPanel'
import MainContent from './mainContent'

import TitleBar from './titleBar'

const LoginPage = () => (
  <section>
    <TitleBar />
    <MainContent>
      <LoginPanel />
    </MainContent>
  </section>
)

export default LoginPage
