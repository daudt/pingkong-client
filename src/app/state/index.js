import {observable} from 'mobx'

class State {
  @observable leaderboard = []
  @observable page = ''
  @observable selectedPlayers = []
}

export default new State()
