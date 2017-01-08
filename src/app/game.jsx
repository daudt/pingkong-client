import { action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import Api from './api/'
import getUserNameElement from './getUserNameElement'
import MainContent from './mainContent'
import state from './state/'
import Panel from './panel'
import TitleBar from './titleBar'
import Toast from './toast'

@observer
class Game extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      winner: null
    }
  }

  _getResultText(user) {
    if (this.state.winner) {
      if (this.state.winner === user) {
        return 'WINNER'
      }
      else {
        return 'LOSER'
      }
    }
  }

  _getClass(user) {
    const classes = ['player']
    if (this.state.winner) {
      if (this.state.winner === user) {
        classes.push('winner')
      }
      else {
        classes.push('loser')
      }
    }
    else {
      classes.push('initial')
    }
    return classes.join(' ')
  }

  render() {

    const createAvatarElement = (user) => {
      if (user.image) {
        return <img className='avatar' src={user.image} />
      } else {
        return <div className='avatar' />
      }
    }

    const createUserSelector = (user, label) => {
      return (
        <div
          onClick={this._handleClick.bind(this, user)}
          className={this._getClass(user)}
          >
          <h1>{label}</h1>
          {createAvatarElement(user)}
          {getUserNameElement(user)}
          <h1>{this._getResultText(user)}</h1>
        </div>
      )
    }

    return (
      <section id="game">
        <TitleBar />
        <MainContent>
          <Panel>
            <h3>
              WHO WON?
            </h3>
            <div className="opponents">
              {createUserSelector(this.props.you, 'YOU')}
              <div className="spacer" />
              {createUserSelector(this.props.them, 'THEM')}
            </div>
            <div className="panel-section flex-row centered">
              {this.state.winner ? (<button ref="submitBtn" onClick={this._handleRecordMatch.bind(this)}>RECORD MATCH</button>) : null}
              <button ref="cancelBtn" onClick={this._handleCancel.bind(this)}>CANCEL</button>
            </div>
          </Panel>
        </MainContent>
      </section>
    )
  }

  _handleClick(winner) {
    this.setState({ winner })
  }

  @action
  _navigateBack() {
    state.setPage('leaderboard')
  }

  _handleRecordMatch() {
    this.refs.submitBtn.setAttribute('disabled', 'disabled')
    this.refs.cancelBtn.setAttribute('disabled', 'disabled')
    Api.recordMatch(this.props.you, this.props.them, this.state.winner)
      .then(() => {
        return new Promise((resolve) => {
          Toast.open(`This match needs to be confirmed (via email) by ${this.props.them.nickname || this.props.them.name}`)
          setTimeout(() => {
            resolve()
          }, 4000)
        })
      })
      .then(() => {
        this._navigateBack()
      })
  }

  _handleCancel() {
    this._navigateBack()
  }

}

export default Game
