import state from 'app/state/'

describe('state', () => {
  it('should initialize observables', () => {
    expect(state.leaderboard).toBeDefined()
    expect(state.page).toBeDefined()
    expect(state.selectedPlayers).toBeDefined()
    expect(state.userRankings).toBeDefined()
    expect(state.winner).toBeDefined()
  })
})
