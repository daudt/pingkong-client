import React from 'react'

import SessionControl from './sessionControl'
import setPage from './setPage'

const TitleBar = () => (
  <header>
    <div className="flex-column">
      <img src="/app/king-pong-logo-wide.png" className="logo" onClick={ setPage } />
      <SessionControl />
    </div>
  </header>
)

export default TitleBar
