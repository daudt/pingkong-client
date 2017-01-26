import React from 'react'

import SessionControl from './sessionControl'
import navigator from './utils/navigator'

const TitleBar = () => (
  <header>
    <div className="flex-column">
      <img src="/app/king-pong-logo-wide.png" className="logo" onClick={ navigator.setPage } />
      <SessionControl />
    </div>
  </header>
)

export default TitleBar
