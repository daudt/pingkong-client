import state from '../state'

function setPage(page) {
  state.setPage(page)
}

function openGamePage(opponent) {
  state.setPage('game', { you: state.me, them: opponent })
}

const navigator = {
  setPage,
  openGamePage
}

export default navigator
