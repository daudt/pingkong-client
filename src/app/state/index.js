import {observable} from 'mobx'

class State {
  @observable leaderboard = []
  @observable page = ''
  @observable selectedPlayers = []
  @observable userRankings = []
  @observable winner = null
  @observable lastWinner = null
  @observable lastLoser = null
}

export default new State()
