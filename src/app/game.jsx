import { action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import Api from './api/'
import getUserNameElement from './getUserNameElement'
import state from './state/'
import Panel from './panel'
import TitleBar from './titleBar'

@observer
class Game extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      winner: null
    }
  }

  _getLabel(user) {
    if (this.state.winner) {
      if (this.state.winner === user) {
        return 'WINNER'
      }
      else {
        return 'LOSER'
      }
    }
    else {
      return ''
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

    const createUserSelector = (user) => {
      return (
        <div
          onClick={this._handleClick.bind(this, user)}
          className={this._getClass(user)}
          >
          {createAvatarElement(user)}
          {getUserNameElement(user)}
          <h1>{this._getLabel(user)}</h1>
        </div>
      )
    }

    return (
      <section id="game">
        <header>
          <TitleBar />
        </header>
        <Panel>
          <h3>
            WHO WON?
          </h3>
          <div className="opponents">
            {createUserSelector(this.props.user1)}
            <div className="spacer" />
            {createUserSelector(this.props.user2)}
          </div>
          <div className="panel-section flex-row centered">
            {this.state.winner ? (<button ref="submitBtn" onClick={this._handleRecordMatch.bind(this)}>RECORD MATCH</button>) : null}
            <button ref="cancelBtn" onClick={this._handleCancel.bind(this)}>CANCEL</button>
          </div>
        </Panel>
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
    Api.recordMatch(this.props.user1, this.props.user2, this.state.winner)
      .then(() => {
        this._navigateBack()
      })
  }

  _handleCancel() {
    this._navigateBack()
  }

}

export default Game
