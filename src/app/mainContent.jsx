import React from 'react'

class MainContent extends React.Component {

  render() {
    return (
      <div className="main-content">
        {this.props.children}
      </div>
    )
  }

}

export default MainContent
