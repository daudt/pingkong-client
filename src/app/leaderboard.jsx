import React from 'react'
import {observer} from 'mobx-react'

import Api from './api/'
import state from './state/'

@observer
class Leaderboard extends React.Component {
  constructor() {
    super()

    Api.getData()
  }

  render() {
    const leaderboard = state.data.map(function(item) {
      return (
        <div key={item.email}>
          <span>{item.rating}</span>
          <span>{item.name}</span>
        </div>
      )
    })
    return (
      <section id='leaderboard'>
        {leaderboard}
      </section>
    )
  }
}

export default Leaderboard
