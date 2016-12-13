import {observable} from 'mobx'

class State {
  @observable leaderboard = []
  @observable loser = null
  @observable page = ''
  @observable selectedPlayers = []
  @observable user = null
  @observable users = [] // TODO: Remove this
  @observable userRankings = []
  @observable winner = null
}

export default new State()
