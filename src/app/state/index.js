import {observable} from 'mobx'

class State {
  @observable leaderboard = []
  @observable selectedPlayers = [] // max of 2
}

export default new State()
