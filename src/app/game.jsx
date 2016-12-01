import {observer} from 'mobx-react'
import React from 'react'

import './app.less'

@observer
class Game extends React.Component {
  render() {
    return (
      <h1>Game page</h1>
    )
  }
}

export default Game
