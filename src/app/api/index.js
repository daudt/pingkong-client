import * as request from 'superagent'

import state from '../state'

const SERVER_URL = 'http://localhost:3000'

class Api {
  static getLeaderboard() {
    this._get('users', '_embed=rankings').then((users) => {
      state.leaderboard = users.map((user) => {
        const rankings = user.rankings.sort(this._sortDateDesc)
        console.log(user.name, rankings[0].rating, rankings[0].created_at)
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
    // const change = parseInt(Math.random() * 10) + 10

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
        let change = null
        if (loser.rating > winner.rating) {
          change = -Math.round((winner.rating - loser.rating)/25)
        }
        else {
          change = Math.round((winner.rating - loser.rating)/125)
        }
        this._get('rankings', `userId=${winner.id}`).then((rankings) => {
          rankings = rankings.sort(this._sortDateDesc)
          this._post('rankings', {
            userId: winner.id,
            rating: rankings[0].rating + change,
            created_at: created
          })
          state.winner = winner
          state.winner.diff = change
        })
      }, 800)

      window.setTimeout(() => {
        let change = null
        if (loser.rating > winner.rating) {
          change = -Math.round((winner.rating - loser.rating)/50)
        }
        else {
          change = Math.round((winner.rating - loser.rating)/100)
        }
        this._get('rankings', `userId=${loser.id}`).then((rankings) => {
          rankings = rankings.sort(this._sortDateDesc)
          this._post('rankings', {
            userId: loser.id,
            rating: rankings[0].rating - change,
            created_at: created
          })
          state.loser = loser
          state.loser.diff = change
        })
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
