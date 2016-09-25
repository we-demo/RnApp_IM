import React, { Component } from 'react'
import {
  Animated, Easing, Keyboard,
  ScrollView, StyleSheet,
  Text, TextInput, View,
} from 'react-native'
import Message from './components/Message'
import Dimensions from 'Dimensions'
import _ from 'lodash'

const BarHeight = 20
const windowHeight = Dimensions.get('window').height - BarHeight
const scrollHeight = windowHeight - 40

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      messages: _.times(100, _.constant({
        from: 'John',
        text: 'Hello!'
      })),
      text: 'aaaa',
      visibleHeight: new Animated.Value(windowHeight),
    }
    this.keyboardWillShow = this.keyboardWillShow.bind(this)
    this.keyboardWillHide = this.keyboardWillHide.bind(this)
    this.updateScrollView = this.updateScrollView.bind(this)
  }

  componentDidMount () {
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  keyboardWillShow(e) {
    const newSize = windowHeight - e.endCoordinates.height;
    Animated.timing(this.state.visibleHeight, {
      toValue: newSize, duration: 300,
    }).start()
  }
  keyboardWillHide() {
    Animated.timing(this.state.visibleHeight, {
      toValue: windowHeight, duration: 10
    }).start()
  }

  updateScrollView (x, y) {
    if (y > scrollHeight) {
      this.refs.scroller.scrollTo({ y: y - scrollHeight })
    }
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
                this.setState({text: ''})
              }}
              value={this.state.text} />
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
    padding: 10,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: 'gray',
  },

  textInput: {
    fontSize: 20,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
  }
})
