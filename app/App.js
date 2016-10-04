import React, { Component } from 'react'
import LoginPage from './LoginPage'
import ChatPage from './ChatPage'

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      user: null
    }

    // self binding
    ;[
      'handleLogin',
    ].forEach((method) => {
      this[method] = this[method].bind(this)
    })
  }

  handleLogin (user) {
    this.setState({ user })
  }

  render () {
    const { user } = this.state
    return user ?
      <ChatPage user={user} /> :
      <LoginPage onLogin={this.handleLogin} />
  }
}
