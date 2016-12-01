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
    const leaderboard = state.leaderboard.map(function(item, index) {
      return (
        <div key={item.email}>
          <span>{index + 1}</span>
          <img src={item.image} />
          <span>{item.rating}</span>
          <span>{item.name} ({item.nickname})</span>
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
