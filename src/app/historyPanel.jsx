import moment from 'moment'
import React from 'react'
import reactStringReplace from 'react-string-replace'
import seedrandom from 'seedrandom'

import Api from './api/'
import Panel from './panel'

const SEED = "why do ninjas always be stealin' my cornbread?"

const NUM_TO_SHOW = 10

const TEMPLATES = [
  'I reckon (W) done beat (L). Told you so!',
  '(W) knocked (L) into next Tuesday.',
  '(W) cracked open a can of whoop-ass on (L).',
  '(W) served (L) a triple venti latte of doom.',
  'Allegedly, (W) won a ping pong match against (L).',
  'When the dust settled, (L) was struggling to stand up from the smoking crater. (W) was already on a plane to Maui.',
  '(L) did not defeat (W), but you gotta admit, that behind-the-back shot was pretty cool.',
  '(W) successfully used some bizarre reverse psychology mind tricks on (L).',
  'It was dramatic, but in the end, (W) was victorious over (L).',
  '(L) is now nursing a bruised ego, courtesy of (W).',
  '(W) made a bigger number than (L).',
  '(L) yelled "I want revenge, (W)! Aaarrghh!" and collapsed.',
  'In a strange turn of events, (W) won! Everyone be like whaaaaaat? (L) is sad.',
  '(W) scored more points than (L), which Charlie Sheen calls "winning".',
  '(W) used the Epic Paddle of +2 Top Spin to defeat (L).',
  '(L) yelled "NooOOoOOooo!" as (W) laughed.',
  '(L) and (W) entered the arena, but only (W) left.',
  'The points scored by (L) were fewer and less impressively executed than (W)\'s.',
  '"Dear (L), please see the attached photo of you crying hysterically, and refer to it often. Signed, (W)."',
  '(L) played (W) and now (L) is in a dirt nap.',
  '(W) utterly destroyed (L). Maybe joining a book club would be more your speed?',
  'The Ukrainian judge gave (W) a 9.5 for style and (L) only a 6.8.',
  '(L) probably woulda won, but was disqualified for wearing a distracting and ridiculous hat. (W) won by default.',
  '(L) bought the farm that (W) was selling.',
  '(W) voted (L) off the mountain.',
  '(W) was so good at stopping (L)\'s serves, you could say it was a denial-of-service attack.',
  '(W) was hitting on (L), but not in that way.',
  '(W) cleaned up on (L) faster than a ShamWow commercial on fast-forward.',
  '(L) lost to (W). Don\'t quit yer day job.',
  '(L) was crushed by (W). The financial ruin does not compare to the emotional turmoil.',
  '(L) took (W) to school, but (W) already knows everything, so that kinda backfired.',
  'Wow. Such ping pong. (W) very winning. Much sad (L).',
  '(W) should be put in quarantine because those skillz are so ill, and (L) couldn\'t handle being exposed to them.',
  '(W) and (L) played. We think (W) won, but the spectators fell asleep from all that boredom.',
  'A "bull in a China shop" is a good way to describe the match, if the bull was (W) and the China shop was (L).',
  '(W) is making it rain at (L)\'s expense.',
  'Try googling "how to beat (W) at ping pong", (L).',
  '(W) bought (L) a one-way ticket to Loser Town.',
  '(L) brought a Wiimote to a ping pong party, failing to read the invitation carefully. (W) won easily.',
  '(L) really flew off the handle. And by that, I mean (L) lost grip of the paddle, which flew across the room, broke in two, and scared (W)\'s cat.',
]

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

  _getRandomForID(id) {
    const rng = seedrandom(SEED)
    let currentID = 0
    let random = rng()
    while(currentID < id) {
      random = rng()
      currentID++
    }
    return random
  }

  render() {
    const getSummaryTextElement = (matchSummary) => {
      const matchID = matchSummary.id
      const template = TEMPLATES[Math.floor(this._getRandomForID(matchID) * TEMPLATES.length)]
      let summaryTextElement = reactStringReplace(template, '(W)', (match) => {
        return <span className="user winner" key={keyCount++}>{matchSummary.winner_name}</span>
      })
      summaryTextElement = reactStringReplace(summaryTextElement, '(L)', (match) => {
        return <span className="user loser" key={keyCount++}>{matchSummary.loser_name}</span>
      })
      return summaryTextElement
    }

    let keyCount = 0
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
                {getSummaryTextElement(matchSummary)}
                {!matchSummary.is_confirmed ? '*' : null}
              </span>
              <span className="date">
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
            LAST {NUM_TO_SHOW} MATCHES
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
