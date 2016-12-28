import {observable} from 'mobx'

class State {
  @observable leaderboard = []
  @observable loser = null
  @observable me = null
  @observable currentPage = {
    name:   null,
    props:  null
  }
  @observable user = null
  @observable users = [] // TODO: Remove this
  @observable userRankings = []

  setPage(pageName, props = null) {
    this.currentPage.name = pageName
    this.currentPage.props = props
  }
}

export default new State()
