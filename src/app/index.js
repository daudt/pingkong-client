import React from 'react'
import ReactDOM from 'react-dom'
import {observer} from 'mobx-react'

import Api from './api/'
import state from './state/'

import './app.less'

@observer
class App extends React.Component {
  constructor() {
    super()

    Api.getData()
  }

  render() {
    const data = state.data.map(function(item) {
      return (
        <div key={item.email}>
          <span>{item.name}</span>
        </div>
      )
    })
    return (
      <section>
        <h1>King of Pong Mountain</h1>
        {data}
      </section>
    )
  }
}

ReactDOM.render((
  <App />
), document.querySelector('main'))
