import moment from 'moment'
import React from 'react'

import Api from './api/'
import Panel from './panel'

const NUM_TO_SHOW = 10

function getMatchDateStr(timestamp) {
  return moment.unix(timestamp).format('MMM D YYYY')
}

class HistoryPanel extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      matchSummaries: []
    }
  }

  componentWillMount() {
    Api.getHistory()
      .then((matchSummaries) => {
        this.setState({ matchSummaries })
      })
  }

  render() {
    if (this.state.matchSummaries.length) {
      let hasUnconfirmed = false
      const summaryElements = this.state.matchSummaries.slice(0, NUM_TO_SHOW).map((matchSummary, i) => {
        if (!matchSummary.confirmed) {
          hasUnconfirmed = true
        }
        const className = [
          'match-summary',
          !matchSummary.is_confirmed ? 'subtle' : null
        ].filter(Boolean).join(' ')
        return (
          <div className="panel-section" key={i}>
            <span className={className}>
              <span>
                <span className="user">
                  {matchSummary.winner_name}
                </span> beat <span className="user">
                  {matchSummary.loser_name}
                </span>
                {!matchSummary.is_confirmed ? '*' : null}
              </span>
              <span>
                {getMatchDateStr(matchSummary.utc)}
              </span>
            </span>
          </div>
        )
      })
      const unconfirmedMemo = hasUnconfirmed ? <div className="panel-subtitle">* Unconfirmed match</div> : null

      return (
        <Panel>
          <h3>
            HISTORY (LAST {NUM_TO_SHOW})
          </h3>
          {summaryElements}
          {unconfirmedMemo}
        </Panel>
      )
    } else {
      return (
        <span></span>
      )
    }
  }

}

export default HistoryPanel
