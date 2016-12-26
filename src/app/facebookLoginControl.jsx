import React from 'react'

import Api from './api/'
import Session from './session'

const BASE_OAUTH_REDIR_URL = 'https://www.kingofpong.com/oauth-done.html'

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
    // pass through the 'home' page we want to redirect to to the prod oauth handler:
    const oAuthRedirUrl = `${BASE_OAUTH_REDIR_URL}?redir=${window.location.href}`
    const url = `${Api.getBaseUrl()}/auth/facebook?auth_origin_url=${encodeURIComponent(oAuthRedirUrl)}`
    window.location.href = url
  }

}

export default FacebookLoginControl
