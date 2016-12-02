import React from 'react'

import state from './state/'

import './logo.less'

class Logo extends React.Component {

  constructor() {
    super()
    setTimeout(this._updateLogo.bind(this), 1000)
  }

  _updateLogo() {
    if (this._img) {
      const rect = this._img.getBoundingClientRect()
      console.log(rect)
      const style = getComputedStyle(this._img)
      if (rect.bottom < -this._img.offsetHeight) {
        state.page = 'leaderboard'
        return
      }

      const currentMargin = parseInt(style.getPropertyValue('margin-top'))
      this._img.style.setProperty('margin-top', `${ currentMargin - (this._img.offsetHeight / 10) }px`)
    }
    requestAnimationFrame(this._updateLogo.bind(this))
  }

  render() {
    return (
      <img src="app/king-pong-logo.png" ref={(img) => this._img = img} />
    )
  }

}

export default Logo
