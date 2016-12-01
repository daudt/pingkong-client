import {observable} from 'mobx'

class State {
  @observable leaderboard = []
  @observable page = ''
  @observable selectedPlayers = []
  @observable winner = {}
}

export default new State()
