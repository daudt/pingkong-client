import * as request from 'superagent'

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

  static postScore() {
    // TODO: Send request to server
    state.page = 'leaderboard'
    state.winner = null
    state.selectedPlayers = []
  }

  static _get(endpoint, query) {
    return new Promise((resolve, reject) => {
      let url = `${SERVER_URL}/${endpoint}`
      if (query) {
        url = `${url}/?${query}`
      }

      request.get(url)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            console.error(err)
            reject(err)
          }

          console.debug('Request:', url, res.body[0])
          resolve(res.body)
        })
    })
  }
}

export default Api
