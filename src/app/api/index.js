import * as request from 'superagent'

import state from '../state'

class Api {

  constructor(fromServer) {

  }

  static getData() {
    request
      .get('https://private-9f7d0-pingkong.apiary-mock.com/rankings')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          console.error(err)
        }
        console.log(res.body[0])
        // state.data = new Api(res.body)
        state.leaderboard = res.body.sort(function(a, b) {
          return b.rating - a.rating
        })
      })
  }

  static postScore() {
    // TODO: Send request to server
    state.page = 'leaderboard'
    state.winner = null
  }
}

export default Api
