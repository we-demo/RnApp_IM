import React, { Component } from 'react'
import {
  StyleSheet,
  Text, TextInput, View,
} from 'react-native'
import Spacer from 'react-native-keyboard-spacer'
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
      messages: _.times(40, () => ({
        id: chance.guid(),
        user: {
          name: chance.first(),
        },
        text: chance.word(),
        color: colors[_.random(0, colors.length - 1)]
      })),
      text: 'aaaa',
    }

    this.contentHeight = null
    this.scrollHeight = null
    this.scrollY = null

    // self binding
    ;[
      'handleTextChange', 'handleSubmit',
      'handleMessage',
    ].forEach(method => {
      this[method] = this[method].bind(this)
    })
  }

  componentDidMount () {
    ws.addListener('message', this.handleMessage)
  }
  componentWillUnmount () {
    ws.removeListener('message', this.handleMessage)
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

  handleMessage (data) {
    console.log('WebSocket received: ' + data)

    // dispatch(receiveMessage(data))
    this.setState({
      messages: [...this.state.messages, data]
    })
  }
  sendMessage (msg) {
    const { user } = this.props
    ws.send({
      id: chance.guid(),
      user,
      ...msg,
    })
  }

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
            onChangeText={this.handleTextChange}
            onSubmitEditing={this.handleSubmit}
            blurOnSubmit={false}
            value={this.state.text} />

          <Spacer />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#F5FCFF',
    paddingTop: 20,
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
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
  }
})
