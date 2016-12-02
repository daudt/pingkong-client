import * as request from 'superagent'
import Elo from 'elo-js'

import state from '../state'

const elo = new Elo()

const SERVER_URL = 'http://localhost:3000'

class Api {
  static getLeaderboard() {
    this._get('users', '_embed=rankings').then((users) => {
      state.leaderboard = users.map((user) => {
        const rankings = user.rankings.sort(this._sortDateDesc)
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
      state.userRankings = rankings.sort(this._sortDateAsc)
    })
  }

  static addMatch(winner, loser) {
    const created = new Date().toISOString()
    const winnerRating = elo.ifWins(winner.rating, loser.rating)
    const loserRating = elo.ifLoses(loser.rating, winner.rating)

    // create the match
    this._post('matches', {
      created_at: created
    }).then((match) => {
      window.setTimeout(() => {
        this._post('match_users', {
          matchId: match.id,
          userId: winner.id
        })
      }, 200)

      window.setTimeout(() => {
        this._post('match_users', {
          matchId: match.id,
          userId: loser.id
        })
      }, 400)

      window.setTimeout(() => {
        this._post('winners', {
          matchId: match.id,
          userId: winner.id
        })
      }, 600)

      window.setTimeout(() => {
        this._post('rankings', {
          userId: winner.id,
          rating: winnerRating,
          created_at: created
        })
        state.winner = winner
        state.winner.diff = winnerRating - winner.rating
      }, 800)

      window.setTimeout(() => {
        this._post('rankings', {
          userId: loser.id,
          rating: loserRating,
          created_at: created
        })
        state.loser = loser
        state.loser.diff = loserRating - loser.rating
      }, 1000)
    })
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

  static _sortDateAsc(a, b) {
    return new Date(a.created_at) - new Date(b.created_at)
  }

  static _sortDateDesc(a, b) {
    return new Date(b.created_at) - new Date(a.created_at)
  }
}

export default Api
