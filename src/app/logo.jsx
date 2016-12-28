import React from 'react'

import state from './state/'

import './logo.less'

const STAGES = [
  'in',
  'rest',
  'out'
]

const REST_MS = 2000

class Logo extends React.Component {

  constructor() {
    super()
    this._img = null
    this._stageIndex = 0
    this._restTimestampMs = null
  }

  _setMarginTop(val) {
    this._img.style.setProperty('margin-top', `${ val }px`)
  }

  _initAnim(img) {
    this._img = img
    if (!img) {
      return
    }
    const rect = this._img.getBoundingClientRect()
    this._setMarginTop(window.innerHeight - rect.top)
    this._updateLogo()
  }

  _updateLogo() {
    const rect = this._img.getBoundingClientRect()
    const style = getComputedStyle(this._img)
    const currentMargin = parseInt(style.getPropertyValue('margin-top'))
    const currStage = STAGES[this._stageIndex]
    if (currStage === 'in') {
      this._setMarginTop(currentMargin - (currentMargin / 10))
      if (Math.abs(currentMargin) < 0.5) {
        this._restTimestampMs = Date.now()
        this._stageIndex++
      }
    } else if (currStage === 'rest') {
      if (Date.now() > this._restTimestampMs + REST_MS) {
        this._restTimestampMs = null
        this._stageIndex++
      }
    } else if (currStage === 'out') {
      this._setMarginTop(currentMargin - (this._img.offsetHeight / 10))
      if (rect.bottom < -this._img.offsetHeight) {
        state.setPage(this.props.dest)
        return
      }
    }
    requestAnimationFrame(this._updateLogo.bind(this))
  }

  render() {
    return (
      <img src="app/king-pong-logo.png" ref={(img) => this._initAnim(img)} />
    )
  }

}

export default Logo
