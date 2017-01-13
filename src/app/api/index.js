import * as request from 'superagent'

import Session from '../session'
import state from '../state'
import Toast from '../toast'

const BASE_URL = 'https://www.kingofpong.com/api'
// const BASE_URL = 'http://localhost:3000/api'

const TOKEN_TYPE = 'Bearer'

function sortDateAsc(a, b) {
  return new Date(a.created_at) - new Date(b.created_at)
}

function sortUsersWhoHavePlayed(a, b) {
  if (a.num_matches === 0 && b.num_matches > 0) {
    return 1
  }
  if (b.num_matches === 0 && a.num_matches > 0) {
    return -1
  }
  return b.rating - a.rating
}

class Api {
  static getBaseUrl() {
    return BASE_URL
  }

  static fetchMe() {
    if (Session.isActive()) {
      return this._get('auth/validate_token')
    } else {
      return Promise.reject('not logged in')
    }
  }

  static createUser(email, password, name, nickname) {
    const data = {
      email,
      password,
      password_confirmation: password,
      name,
      nickname
    }
    return this._post('auth', data)
  }

  static loginUser(email, password) {
    const data = { email, password }
    return this._post('auth/sign_in', data)
      .then((response) => {
        return {
          clientID:       response.headers['client'],
          expirationSecs: response.headers['expiry'],
          token:          response.headers['access-token'],
          uid:            response.headers['uid']
        }
      })
  }

  static getUsers() {
    this._get('users').then((users) => {
      console.debug('users:', users)
    })
  }

  static getHistory() {
    return this._get('history')
  }

  static _fixRankingsResponse(response) {
    const insecureMatcher = /^http:\/\//i
    const secureMatcher = /^https:\/\//i

    function fixImageProtocol(isSecurePage, user) {
      if (user.image) {
        const isSecureImage = user.image.match(secureMatcher)
        if (!isSecureImage && isSecurePage) {
          user.image = user.image.replace(insecureMatcher, 'https://')
        }
      }
      return user
    }

    const isSecurePage = window.location.href.match(secureMatcher)
    return response
      .map((user) => fixImageProtocol(isSecurePage, user))
  }

  static getRankedUsers() {
    return this._get('rankings')
      .then((leaderboardUsers) => Api._fixRankingsResponse(leaderboardUsers))
      .then((leaderboardUsers) => leaderboardUsers.sort(sortUsersWhoHavePlayed))
  }

  static getRankingsByUser(user) {
    this._get(`rankings/${user.id}`).then((rankings) => {
      state.userRankings = Api._fixRankingsResponse(rankings).sort(sortDateAsc)
    })
  }

  static recordMatch(player1, player2, winningPlayer) {
    const data = {
      player1:  player1.id,
      player2:  player2.id,
      winner:   winningPlayer.id
    }
    return this._post('matches', data)
  }

  static _get(endpoint, query) {
    return new Promise((resolve, reject) => {
      let url = `${BASE_URL}/${endpoint}`
      if (query) {
        url = `${url}?${query}`
      }

      if (Session.isActive()) {
        console.debug('Get (authenticated):', url)
        request.get(url)
          .set('token-type',    TOKEN_TYPE)
          .set('client',        Session.getClientID())
          .set('uid',           Session.getUID())
          .set('access-token',  Session.getToken())
          .set('Accept',        'application/json')
          .end((err, res) => {
            if (err) {
              Toast.open(err.message)
              console.error(err)
              reject(err)
            } else {
              resolve(res.body)
            }
          })
      } else {
        console.debug('Get:', url)
        request.get(url)
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err) {
              Toast.open(err.message)
              console.error(err)
              reject(err)
            } else {
              resolve(res.body)
            }
          })
      }
    })
  }

  static _post(endpoint, data) {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}/${endpoint}`

      if (Session.isActive()) {
        console.debug('Post (authenticated)', data)
        request.post(url, data)
          .set('token-type',    TOKEN_TYPE)
          .set('client',        Session.getClientID())
          .set('uid',           Session.getUID())
          .set('access-token',  Session.getToken())
          .set('Accept',        'application/json')
          .set('Content-Type',  'application/json')
          .end((err, res) => {
            if (err) {
              Toast.open(err.message)
              console.error(err)
              reject(err)
            } else {
              resolve(res)
            }
          })
      } else {
        console.debug('Post:', url, data)
        request.post(url, data)
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err) {
              Toast.open(err.message)
              console.error(err)
              reject(err)
            } else {
              resolve(res)
            }
          })
      }
    })
  }

  static _put(endpoint, data) {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}/${endpoint}`

      if (Session.isActive()) {
        console.debug('Post (authenticated)', data)
        request.put(url, data)
          .set('token-type',    TOKEN_TYPE)
          .set('client',        Session.getClientID())
          .set('uid',           Session.getUID())
          .set('access-token',  Session.getToken())
          .set('Accept',        'application/json')
          .set('Content-Type',  'application/json')
          .end((err, res) => {
            if (err) {
              Toast.open(err.message)
              console.error(err)
              reject(err)
            } else {
              resolve(res)
            }
          })
      } else {
        reject()
      }
    })
  }

}

export default Api
