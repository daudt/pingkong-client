import * as React from 'react'

class Toast extends React.Component {

  constructor() {
    super()
    this.state = {}
  }

  static open(message) {
    Toast._component._open(message)
  }

  render() {
    if (!this.state.message) {
      return null
    }

    return (
      <div id='toast'>
        {this.state.message}
      </div>
    )
  }

  componentWillMount() {
    Toast._component = this
  }

  componentWillUnmount() {
    Toast._component = null
  }

  _open(message) {
    this.setState({
      message
    })

    setTimeout(() => {
      this._close()
    }, 10000)
  }

  _close() {
    this.setState({
      message: null,
    })
  }
}

export default Toast
