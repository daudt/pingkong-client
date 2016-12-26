import React from 'react'

import Api from './api/'
import Session from './session'

const OAUTH_REDIR_URL = 'https://www.kingofpong.com/oauth-done.html'

class FacebookLoginControl extends React.Component {

  render() {
    const getButton = () => {
      if (!Session.isActive()) {
        return (
          <button onClick={this._handleFacebookLogin.bind(this)}>
            FACEBOOK LOGIN
          </button>
        )
      }
    }

    return (
      <div>{getButton()}</div>
    )
  }

  _handleFacebookLogin() {
    const url = `${Api.getBaseUrl()}/auth/facebook?auth_origin_url=${encodeURIComponent(OAUTH_REDIR_URL)}`
    window.location.href = url
  }

}

export default FacebookLoginControl
