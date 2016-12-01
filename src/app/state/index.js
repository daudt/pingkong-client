import {observable} from 'mobx'

class State {
  @observable leaderboard = []
}

export default new State()
