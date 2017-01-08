import React from 'react'

import Api from './api/'
import Panel from './panel'
import MainContent from './mainContent'
import SessionControl from './sessionControl'
import state from './state/'
import TitleBar from './titleBar'

class ProfilePage extends React.Component {

  render() {
    return (
      <section>
        <TitleBar />
        <MainContent>
          <Panel>
            <div className="panel-section">
              PROFILE
              <div className="vertical-form">
                <label>
                  Nickname
                  <input className="nickname" ref="nicknameInput" defaultValue={state.me.nickname} />
                </label>
                <span>
                  <button ref="updateBtn" onClick={this._handleUpdate.bind(this)}>
                    UPDATE
                  </button>
                  <button ref="cancelBtn" onClick={this._handleCancel.bind(this)}>
                    CANCEL
                  </button>
                </span>
              </div>
            </div>
          </Panel>
        </MainContent>
      </section>
    )
  }

  _handleUpdate() {
    this.refs.updateBtn.setAttribute('disabled', 'disabled')
    this.refs.cancelBtn.setAttribute('disabled', 'disabled')
    const data = {
      id: state.me.id,
      nickname: 'blah'
    }
    console.log('data', data)
    Api._post('user', data)
      .then((blah) => console.log('got', blah))
  }

  _handleCancel() {
    state.setPage('leaderboard')
  }

}

export default ProfilePage
