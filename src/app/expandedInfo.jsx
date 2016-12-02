import {observer} from 'mobx-react'
import React from 'react'
import Chart from 'chart.js'

import Api from './api/'
import state from './state/'

@observer
class ExpandedInfo extends React.Component {
  _userRankings = null

  componentWillMount() {
    Api.getRankingsByUser(this.props.user)
  }

  render() {
    this._userRankings = state.userRankings
    return (
      <div id="chart-container">
        <canvas id="myChart" width="400" height="400"></canvas>
      </div>
    )
  }

  componentDidUpdate() {
    const data = state.userRankings.map(function(point) {
      return point.rating
    })
    const created = state.userRankings.map(function(point) {
      return new Date(point['created_at']).toDateString()
    })
    new Chart(document.getElementById('myChart'), {
      type: 'line',
      data: {
        labels: created,
        datasets: [
            {
              label: 'Elo Rating',
              data: data,
              // borderColor: 'pink',
              // backgroundColor: 'blue'
            }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true
      }
    })
  }
}

export default ExpandedInfo
