import {observer} from 'mobx-react'
import React from 'react'
import Chart from 'chart.js'

import Api from './api/'
import state from './state/'

@observer
class ExpandedInfo extends React.Component {
  constructor() {
    super()

    this._userRankings = null

    Api.getRankingsByUser()
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
    console.warn('created', created)
    new Chart(document.getElementById('myChart'), {
      type: 'line',
      data: {
        labels: created,
        // labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
              label: 'Elo Rankings Over Time',
              data: data
              // data: [65, 59, 80, 81, 56, 55, 40]
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
