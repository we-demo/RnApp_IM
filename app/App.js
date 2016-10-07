import React, { Component } from 'react'
import { Platform, View } from 'react-native'
import KeyboardSpacer from 'react-native-keyboard-spacer'
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
      'handleLogin', 'handleLogout',
    ].forEach((method) => {
      this[method] = this[method].bind(this)
    })
  }

  handleLogin (user) {
    this.setState({ user })
  }
  handleLogout () {
    this.setState({ user: null })
  }

  render () {
    const { user } = this.state
    return (
      <View style={{ flex: 1 }}>
        {user ?
          <ChatPage user={user} onLogout={this.handleLogout} /> :
          <LoginPage onLogin={this.handleLogin} />}

        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </View>
    )
  }
}
