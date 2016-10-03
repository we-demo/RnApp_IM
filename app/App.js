import React, { Component } from 'react'
import {
  Keyboard,
  ScrollView, StyleSheet,
  Text, TextInput, View,
} from 'react-native'
import Spacer from 'react-native-keyboard-spacer'
import Message from './components/Message'
import ws from './ws'
import _ from 'lodash'

const noop = () => {}
const user = {
  id: 'fritz.lin',
  name: 'Fritz',
}

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      messages: _.times(40, _.constant({
        user: {
          id: 'royson.huang',
          name: 'Royson',
        },
        text: 'Hello!'
      })),
      text: 'aaaa',
    }

    this.contentHeight = null
    this.scrollHeight = null
    this.scrollY = null

    // self binding
    ;[
      'handleKeyboardShow', 'handleKeyboardHide',
      'handleScroll', 'handleLayout', 'handleContentChange',
      'handleTextChange', 'handleSubmit',
      'handleMessage',
    ].forEach((method) => {
      this[method] = this[method].bind(this)
    })
  }

  componentDidMount () {
    ws.onmessage = this.handleMessage

    setTimeout(() => {
      this.sendMessage({ type: 'serverJOIN' })
    }, 200)

    Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow)
    Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide)
  }
  componentWillUnmount () {
    ws.onmessage = noop
    Keyboard.removeListener('keyboardDidShow', this.handleKeyboardShow)
    Keyboard.removeListener('keyboardDidHide', this.handleKeyboardHide)
  }

  handleKeyboardShow () {
    const { scrollHeight, contentHeight } = this
    if (contentHeight > scrollHeight) {
      this.refs.scroller.scrollTo({ y: contentHeight - scrollHeight })
    }
  }
  handleKeyboardHide () {
    const { scrollY, scrollHeight, contentHeight } = this
    if (scrollY > contentHeight - scrollHeight) {
      this.refs.scroller.scrollTo({ y: 0 })
    }
    else 
    if (contentHeight > scrollHeight) {
      this.refs.scroller.scrollTo({ y: contentHeight - scrollHeight })
    }
  }

  handleScroll (e) {
    this.scrollY = e.nativeEvent.contentOffset.y
    console.log('handleScroll', { scrollY: this.scrollY })
  }
  handleLayout (e) {
    this.scrollHeight = e.nativeEvent.layout.height
    console.log('handleLayout', { scrollHeight: this.scrollHeight })
  }

  handleContentChange (w, h) {
    this.contentHeight = h

    if (this.scrollHeight == null) {
      setTimeout(() => {
        this.scrollToBottomIfNecessary()
      }, 500)
    }
    else {
      this.scrollToBottomIfNecessary()
    }
  }

  scrollToBottomIfNecessary () {
    // todo: range detection
    this.scrollToBottom()
  }
  scrollToBottom () {
    const { scrollHeight, contentHeight } = this
    if (scrollHeight == null) {
      return
    }
    if (contentHeight > scrollHeight) {
      this.refs.scroller.scrollTo({ y: contentHeight - scrollHeight })
    }
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

  handleMessage (e) {
    console.log('WebSocket received: ' + e.data)

    // dispatch(receiveMessage(e.data))
    const newMsg = JSON.parse(e.data)
    this.setState({
      messages: [...this.state.messages, newMsg]
    })
  }
  sendMessage (msg) {
    ws.send(JSON.stringify({
      user,
      ...msg,
    }))
  }

  render () {
    return (
      <View style={styles.bg}>
        <View style={styles.container}>
          <View style={styles.msgsView}>
            <ScrollView ref="scroller"
              contentContainerStyle={styles.scrollContainer}
              scrollEventThrottle={16}
              onScroll={this.handleScroll}
              onLayout={this.handleLayout}
              onContentSizeChange={this.handleContentChange}>
              {this.state.messages.map((msg, i) => {
                return <Message key={i} message={msg} />
              })}
            </ScrollView>
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
