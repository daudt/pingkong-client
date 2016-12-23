import * as request from 'superagent'
import urlParser from 'url-parse'

import state from '../state'

const SERVER_URL = 'https://www.kingofpong.com/api'

// update these to change how the ELO ratings are affected
// const WINNER_SCORE = 1
// const LOSER_SCORE = 0

const TOKEN_TYPE = 'Bearer'

function sortDateAsc(a, b) {
  return new Date(a.created_at) - new Date(b.created_at)
}

function sortDateDesc(a, b) {
  return new Date(b.created_at) - new Date(a.created_at)
}

class Api {
  static getBaseUrl() {
    return SERVER_URL
  }

  static createUser(email, password, name, nickname) {
    const body = {
      email,
      password,
      password_confirmation: password,
      name,
      nickname
    }
    this._post('auth', body)
  }

  static loginUser(email, password) {
    const body = { email, password }
    return this._post('auth/sign_in', body).then((response) => {
      console.debug('body:', response.body)
      console.debug('headers:', response.headers)
      state.user = {
        client:         response.headers['client'],
        uid:            response.headers['uid'],
        'access-token': response.headers['access-token']
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
    const body = {
      player1:  player1.id,
      player2:  player2.id,
      winner:   winningPlayer.id
    }
    this._post('matches', body).then((response) => {
      console.warn('response', response)
    })
    // const created = new Date().toISOString()

    // const eloRating = new EloRating(winner.rating, loser.rating, WINNER_SCORE, LOSER_SCORE)
    // const newRatings = eloRating.getNewRatings()
    // const winnerRating = newRatings.winners
    // const loserRating = newRatings.losers

    // create the match
    // this._post('matches', {
    //   created_at: created
    // }).then((match) => {
    //   window.setTimeout(() => {
    //     this._post('match_users', {
    //       matchId: match.id,
    //       userId: winner.id
    //     })
    //   }, 100)
    //
    //   window.setTimeout(() => {
    //     this._post('match_users', {
    //       matchId: match.id,
    //       userId: loser.id
    //     })
    //   }, 200)
    //
    //   window.setTimeout(() => {
    //     this._post('winners', {
    //       matchId: match.id,
    //       userId: winner.id
    //     })
    //   }, 300)
    //
    //   window.setTimeout(() => {
    //     this._post('rankings', {
    //       userId: winner.id,
    //       rating: winnerRating,
    //       created_at: created
    //     })
    //     state.winner = winner
    //     state.winner.diff = winnerRating - winner.rating
    //   }, 400)
    //
    //   window.setTimeout(() => {
    //     this._post('rankings', {
    //       userId: loser.id,
    //       rating: loserRating,
    //       created_at: created
    //     })
    //     state.loser = loser
    //     state.loser.diff = loser.rating - loserRating
    //   }, 500)
    // })
  }

  static _get(endpoint, query) {
    return new Promise((resolve, reject) => {
      let url = `${SERVER_URL}/${endpoint}`
      if (query) {
        url = `${url}?${query}`
      }

      if (state.user) {
        console.debug('Get (authenticated):', url)
        request.get(url)
          .set('token-type',    TOKEN_TYPE)
          .set('client',        Api._getHeader('client'))
          .set('uid',           Api._getHeader('uid'))
          .set('access-token',  Api._getHeader('access-token'))
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

  static _getHeader(field) {
    const parsedUrl = urlParser(window.location.href, true)
    if (field === 'access-token') {
      return (state.user && state.user['access-token']) || parsedUrl.query['auth_token']
    }
    if (field === 'client') {
      return (state.user && state.user['client']) || parsedUrl.query['client_id']
    }
    return (state.user && state.user[field]) || parsedUrl.query[field]
  }

  static _post(endpoint, data) {
    function hasOAuthToken() {
      const parsedUrl = urlParser(window.location.href, true)
      return !!parsedUrl.query['auth_token']
    }

    return new Promise((resolve, reject) => {
      let url = `${SERVER_URL}/${endpoint}`

      const parsedUrl = urlParser(window.location.href, true)
      console.log('url', parsedUrl)

      if (state.user || hasOAuthToken()) {
        console.debug('Post (authenticated)', url, data, state.user, Api._getHeader('client'), Api._getHeader('uid'), Api._getHeader('access-token'))
        request.post(url, data)
          .set('token-type',    TOKEN_TYPE)
          .set('client',        Api._getHeader('client'))
          .set('uid',           Api._getHeader('uid'))
          .set('access-token',  Api._getHeader('access-token'))
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
