import React from 'react'

class Panel extends React.Component {

  componentDidMount() {
    setTimeout(() => {
      this._panelElement.classList.remove('hidden')
    }, 0)
  }

  render() {
    const className = `panel hidden ${this.props.className}`

    return (
      <div className={className} ref={(el) => this._panelElement = el}>
        {this.props.children}
      </div>
    )
  }

}

export default Panel
