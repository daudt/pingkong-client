import * as request from 'superagent'

import Session from '../session'
import state from '../state'

const BASE_URL = 'https://www.kingofpong.com/api'

const TOKEN_TYPE = 'Bearer'

function sortDateAsc(a, b) {
  return new Date(a.created_at) - new Date(b.created_at)
}

function sortDateDesc(a, b) {
  return new Date(b.created_at) - new Date(a.created_at)
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
      state.users = users
    })
  }

  static getLeaderboard() {
    this._get('rankings').then((users) => {
      console.debug('/rankings users:', users)
      if (users.length) {
        state.leaderboard = users
        // state.leaderboard = users.map((user) => {
        //   const rankings = user.rankings.sort(sortDateDesc)
        //   Object.assign(user, {
        //     rating: (rankings.length) ? rankings[0].rating : 0
        //   })
        //   delete user.rankings
        //   return user
        // }).sort((a, b) => b.rating - a.rating)
      } else {
        state.leaderboard = []
      }
    })
  }

  static getRankingsByUser(user) {
    this._get('rankings', `userId=${user.id}`).then((rankings) => {
      state.userRankings = rankings.sort(sortDateAsc)
    })
  }

  static recordMatch(player1, player2, winningPlayer) {
    const data = {
      player1:  player1.id,
      player2:  player2.id,
      winner:   winningPlayer.id
    }
    this._post('matches', data).then((response) => {
      console.warn('response', response)
    })
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
              console.error(err)
              reject(err)
            }

            resolve(res.body)
          })
      } else {
        console.debug('Get:', url)
        request.get(url)
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err) {
              console.error(err)
              reject(err)
            }

            resolve(res.body)
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
              console.error(err)
              reject(err)
            }

            resolve(res)
          })
      } else {
        console.debug('Post:', url, data)
        request.post(url, data)
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err) {
              console.error(err)
              reject(err)
            }

            resolve(res)
          })
      }
    })
  }
}

export default Api
