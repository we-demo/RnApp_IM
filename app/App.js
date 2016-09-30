import React, { Component } from 'react'
import {
  Animated, Easing,
  ScrollView, StyleSheet,
  Text, TextInput, View,
} from 'react-native'
import Spacer from 'react-native-keyboard-spacer'
import Message from './components/Message'
import ws from './ws'
import Dimensions from 'Dimensions'
import _ from 'lodash'

const user = {
  id: 'fritz.lin',
  name: 'Fritz',
}
const BarHeight = 20
const windowHeight = Dimensions.get('window').height - BarHeight
const scrollHeight = windowHeight - 40

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      messages: _.times(20, _.constant({
        user: {
          id: 'royson.huang',
          name: 'Royson',
        },
        text: 'Hello!'
      })),
      text: 'aaaa',
      visibleHeight: new Animated.Value(windowHeight),
    }
    this.updateScrollView = this.updateScrollView.bind(this)
  }

  componentDidMount () {
    ws.onmessage = (e) => {
      console.log('WebSocket received: ' + e.data)

      // dispatch(receiveMessage(e.data))
      const newMsg = JSON.parse(e.data)
      this.setState({
        messages: this.state.messages.concat(newMsg)
      })
    }

    setTimeout(() => {
      this.sendMessage({ type: 'serverJOIN' })
    }, 200)
  }

  updateScrollView (x, y) {
    if (y > scrollHeight) {
      this.refs.scroller.scrollTo({ y: y - scrollHeight })
    }
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
        <Animated.View style={{ height: this.state.visibleHeight }}>
          <View style={styles.container}>
            <View style={styles.msgsView}>
              <ScrollView ref="scroller"
                contentContainerStyle={styles.scrollContainer}
                onContentSizeChange={this.updateScrollView}>
                {this.state.messages.map((msg, i) => {
                  return <Message key={i} message={msg} />
                })}
              </ScrollView>
            </View>

            <TextInput style={styles.textInput}
              onChangeText={(text) => this.setState({text})}
              onSubmitEditing={() => {
                this.sendMessage({ text: this.state.text })
                this.setState({ text: '' })
              }}
              value={this.state.text} />

            <Spacer />
          </View>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#F5FCFF',
    paddingTop: BarHeight,
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
