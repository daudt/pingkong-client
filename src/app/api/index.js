import * as request from 'superagent'
import { action } from 'mobx'

import state from '../state'

const SERVER_URL = 'http://localhost:3000'

class Api {
  static getLeaderboard() {
    this._get('users', '_embed=rankings').then((users) => {
      state.leaderboard = users.map((user) => {
        const rankings = user.rankings.sort((a, b) => b.created_at - a.created_at)
        Object.assign(user, {
          rating: (rankings.length) ? rankings[0].rating : 0
        })
        delete user.rankings
        return user
      }).sort((a, b) => b.rating - a.rating)
    })
  }

  static getRankingsByUser(user) {
    this._get('rankings', `userId=${user.id}`).then((rankings) => {
      state.userRankings = rankings.sort((a, b) => b.created_at - a.created_at)
    })
  }

  static addMatch(winner, loser) {
    const created = new Date().toISOString()

    // create the match
    this._post('matches', {
      created_at: created
    }).then((match) => {
      const change = parseInt(Math.random() * 10) + 10

      let oldWinnerRating
      let newWinnerRating
      let oldLoserRating
      let newLoserRating

      // add the users, winner and update rankings
      const promises = [
        this._post('match_users', {
          matchId: match.id,
          userId: winner.id
        }),
        this._post('match_users', {
          matchId: match.id,
          userId: loser.id
        }),
        this._post('winners', {
          matchId: match.id,
          userId: winner.id
        }),
        this._get('rankings', `userId=${winner.id}`).then((rankings) => {
          rankings = rankings.sort((a, b) => b.created_at - a.created_at)
          oldWinnerRating = rankings[0].rating
          newWinnerRating = oldWinnerRating + change
          return this._post('rankings', {
            userId: winner.id,
            rating: newWinnerRating,
            created_at: created
          })
        }),
        this._get('rankings', `userId=${loser.id}`).then((rankings) => {
          rankings = rankings.sort((a, b) => b.created_at - a.created_at)
          oldLoserRating = rankings[0].rating
          newLoserRating = oldLoserRating - change
          return this._post('rankings', {
            userId: loser.id,
            rating: newLoserRating,
            created_at: created
          })
        })
      ]

      Promise.all(promises).then(() => {
        Object.assign(winner, {
          oldRating: oldWinnerRating,
          newRating: newWinnerRating
        })
        Object.assign(loser, {
          oldRating: oldLoserRating,
          newRating: newLoserRating
        })

        this._loadLastMatch(winner, loser)
      })
    })
  }

  @action
  static _loadLastMatch(winner, loser) {
    state.lastWinner = winner
    state.lastLoser = loser
    state.page = 'leaderboard'
  }

  static _get(endpoint, query) {
    return new Promise((resolve, reject) => {
      let url = `${SERVER_URL}/${endpoint}`
      if (query) {
        url = `${url}/?${query}`
      }

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
          resolve(res.body)
        })
    })
  }
}

export default Api
