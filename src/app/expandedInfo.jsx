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
    const created = state.userRankings.map((point) => {
      return this._getFormattedDate(new Date(point['created_at']))
    })
    Chart.defaults.global.defaultFontColor = 'white'
    new Chart(document.getElementById('myChart'), {
      type: 'line',
      data: {
        labels: created,
        datasets: [
            {
              label: 'Elo Rating',
              data: data,
              // borderColor: '#ea3e3a',
              // borderWidth: 1,
              backgroundColor: '#2AE38B'
            }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true
      }
    })
  }

  _getFormattedDate(date) {
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return year + '-' + month + '-' + day;
}

}

export default ExpandedInfo
