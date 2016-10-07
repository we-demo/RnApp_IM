import React, { Component } from 'react'
import {
  Keyboard, Platform, StyleSheet,
  Text, TextInput, View,
} from 'react-native'
import Message from './components/Message'
import AutoScroll from './components/AutoScroll'
import ws from './ws'
import _ from 'lodash'
import Chance from 'chance'

const chance = new Chance()
const colors = ['#2196F3', '#009688', '#EF6C00', '#01579B', '#CCC907']

export default class ChatPage extends Component {
  constructor () {
    super()
    this.state = {
      // messages: _.times(40, () => ({
      //   id: chance.guid(),
      //   user: {
      //     name: chance.first(),
      //   },
      //   text: chance.word(),
      //   color: colors[_.random(0, colors.length - 1)]
      // })),
      padding: 0,
      messages: [],
      text: '',
    }

    this.contentHeight = null
    this.scrollHeight = null
    this.scrollY = null

    // self binding
    ;[
      'handleTextChange', 'handleSubmit',
      'handleWsMessage', 'handleWsClose',
      'handleKeyboardShow', 'handleKeyboardHide',
    ].forEach(method => {
      this[method] = this[method].bind(this)
    })
  }

  componentDidMount () {
    Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow)
    Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide)
    ws.addListener('message', this.handleWsMessage)
    ws.addListener('close', this.handleWsClose)
    ws.send({
      type: 'allMessages'
    })
  }
  componentWillUnmount () {
    Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow)
    Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide)
    ws.removeListener('message', this.handleWsMessage)
    ws.addListener('close', this.handleWsClose)
  }

  handleKeyboardShow (e) {
    this.setState({ padding: e.endCoordinates.height })
  }
  handleKeyboardHide () {
    this.setState({ padding: 0 })
  }

  handleTextChange (text) {
    this.setState({ text })
  }
  handleSubmit () {
    const { text } = this.state
    if (text.trim() === '') return
    this.sendMessage({ text })
    this.setState({ text: '' })
  }

  handleWsClose () {
    this.props.onLogout()
  }
  handleWsMessage (data) {
    console.log('WebSocket received: ', data)

    if (data.type === 'allMessages') {
      this.setState({
        messages: data.messages
      })
    }
    else if (data.type === 'message') {
      this.setState({
        messages: [...this.state.messages, data]
      })
    }
  }
  sendMessage (msg) {
    const { user } = this.props
    ws.send({
      id: chance.guid(),
      user,
      ...msg,
    })
  }

  // KeyboardSpacer only fits iOS
  // https://github.com/Andr3wHur5t/react-native-keyboard-spacer/issues/37
  render () {
    return (
      <View style={styles.bg}>
        <View style={styles.container}>
          <View style={styles.msgsView}>
            <AutoScroll
              contentContainerStyle={styles.scrollContainer}>
              {this.state.messages.map(msg => {
                return <Message key={msg.id} message={msg} />
              })}
            </AutoScroll>
          </View>

          <TextInput ref="textInput" style={styles.textInput}
            underlineColorAndroid="transparent"
            onChangeText={this.handleTextChange}
            onSubmitEditing={this.handleSubmit}
            blurOnSubmit={false}
            value={this.state.text} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#F5FCFF',
    flex: 1,

    // iOS should pad status bar
    ...Platform.select({
      ios: {
        paddingTop: 20
      }
    })
  },
  container: {
    flex: 1
  },

  msgsView: {
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: 'gray',
  },
  scrollContainer: {
    padding: 10,
  },

  textInput: {
    fontSize: 20,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,

    // Android TextInput has padding itself
    paddingTop: 2,
    paddingBottom: 6,
  }
})
