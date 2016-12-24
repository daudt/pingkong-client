import React from 'react'

class Panel extends React.Component {

  componentDidMount() {
    this._panelElement.classList.remove('hidden')
  }

  render() {
    return (
      <div className="panel hidden" ref={(el) => this._panelElement = el}>
        {this.props.children}
      </div>
    )
  }

}

export default Panel
