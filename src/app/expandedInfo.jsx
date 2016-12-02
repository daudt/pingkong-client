import {observer} from 'mobx-react'
import React from 'react'
import Chart from 'chart.js'

@observer
class ExpandedInfo extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div id="chart-container">
        <canvas id="myChart" width="400" height="400"></canvas>
      </div>
    )
  }

  componentDidMount() {
    console.warn(document.getElementById('myChart'))
    new Chart(document.getElementById('myChart'), {
      type: 'line',
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
              label: "Elo Rankings Over Time",
              data: [65, 59, 80, 81, 56, 55, 40]
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
