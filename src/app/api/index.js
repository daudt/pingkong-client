import * as request from 'superagent'

import EloRating from './eloRating'
import state from '../state'

const SERVER_URL = 'http://kingofpong.com'

// update these to change how the ELO ratings are affected
const WINNER_SCORE = 1
const LOSER_SCORE = 0

class Api {
  static createUser() {
    // this._get('auth/facebook', 'auth_origin_url=http://localhost:7464').then((response) => {
    // this._get('auth/facebook', 'auth_origin_url=http://google.com').then((response) => {
    //   debugger
    // })


    const body = {
      'email': 'akessock@gmail.com',
      'password': 'foobarbaz',
      'password_confirmation': 'foobarbaz',
      'name': 'Alex Kessock',
      'nickname': 'Keysox'
    }

    this._post('auth', body)
  }

  static loginUser(email, password) {
    const body = {
      'email': email,
      'password': password
    }
    return this._post('auth/sign_in', body).then((response) => {
      console.debug('body:', response.body)
      console.debug('headers:', response.headers)
      state.user = {
        'token-type': response.headers['token-type'],
        'client': response.headers['client'],
        'uid': response.headers['uid'],
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
        //   const rankings = user.rankings.sort(this._sortDateDesc)
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
      state.userRankings = rankings.sort(this._sortDateAsc)
    })
  }

  static addMatch(winner, loser) {
    const created = new Date().toISOString()

    const eloRating = new EloRating(winner.rating, loser.rating, WINNER_SCORE, LOSER_SCORE)
    const newRatings = eloRating.getNewRatings()
    const winnerRating = newRatings.winners
    const loserRating = newRatings.losers

    // create the match
    this._post('matches', {
      created_at: created
    }).then((match) => {
      window.setTimeout(() => {
        this._post('match_users', {
          matchId: match.id,
          userId: winner.id
        })
      }, 100)

      window.setTimeout(() => {
        this._post('match_users', {
          matchId: match.id,
          userId: loser.id
        })
      }, 200)

      window.setTimeout(() => {
        this._post('winners', {
          matchId: match.id,
          userId: winner.id
        })
      }, 300)

      window.setTimeout(() => {
        this._post('rankings', {
          userId: winner.id,
          rating: winnerRating,
          created_at: created
        })
        state.winner = winner
        state.winner.diff = winnerRating - winner.rating
      }, 400)

      window.setTimeout(() => {
        this._post('rankings', {
          userId: loser.id,
          rating: loserRating,
          created_at: created
        })
        state.loser = loser
        state.loser.diff = loser.rating - loserRating
      }, 500)
    })
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
          .set('token-type', state.user['token-type'])
          .set('client', state.user['client'])
          .set('uid', state.user['uid'])
          .set('access-token', state.user['access-token'])
          .set('Accept', 'application/json')
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
      let url = `${SERVER_URL}/${endpoint}`
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
    })
  }

  static _sortDateAsc(a, b) {
    return new Date(a.created_at) - new Date(b.created_at)
  }

  static _sortDateDesc(a, b) {
    return new Date(b.created_at) - new Date(a.created_at)
  }
}

export default Api
