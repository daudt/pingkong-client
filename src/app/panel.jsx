import React from 'react'

class Panel extends React.Component {

  componentDidMount() {
    // ugh!  http://stackoverflow.com/a/34999925
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        this.refs.panelElement.classList.remove('hidden')
      })
    }, 0)
  }

  render() {
    const className = [
      'panel',
      'hidden',
      this.props.className
    ].filter(Boolean).join(' ')

    return (
      <div className={className} ref="panelElement">
        {this.props.children}
      </div>
    )
  }

}

export default Panel
