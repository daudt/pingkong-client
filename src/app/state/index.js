import {observable} from 'mobx'

class State {
  @observable leaderboard = []
  @observable leader = null
  @observable me = null
  @observable currentPage = {
    name:   null,
    props:  null
  }
  @observable userRankings = []

  setPage(pageName, props = null) {
    this.currentPage.name = pageName
    this.currentPage.props = props
  }
}

export default new State()
