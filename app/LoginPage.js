import React, { Component } from 'react'
import {
  Platform, StyleSheet,
  Text, TextInput, View,
} from 'react-native'
import Chance from 'chance'
import Button from 'apsl-react-native-button'
import ws from './ws'

const chance = new Chance()

export default class LoginPage extends Component {
  constructor () {
    super()
    this.state = {
      name: chance.first()
    }

    // self binding
    ;[
      'handleTextChange',
      'handleSubmit', 'handlePress'
    ].forEach((method) => {
      this[method] = this[method].bind(this)
    })
  }

  handleTextChange (name) {
    this.setState({ name })
  }
  handleSubmit () {
    this.login()
  }
  handlePress () {
    this.login()
  }

  login () {
    const { name } = this.state
    const user = { name: name.trim() }

    ws.send({
      id: chance.guid(),
      user,
      type: 'serverJOIN'
    })

    this.props.onLogin(user)
  }

  // Android TextInput has bottom border itself
  // using underlineColorAndroid="transparent"
  // http://facebook.github.io/react-native/docs/textinput.html#textinput
  render () {
    return (
      <View style={styles.bg}>
        <View style={styles.container}>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              onChangeText={this.handleTextChange}
              value={this.state.name} />
          </View>

          <View>
            <Button style={styles.button} textStyle={styles.buttonText}
              onPress={this.handlePress}>
              Join
            </Button>
          </View>
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputWrapper: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: 'gray',
  },
  input: {
    textAlign: 'center',
    width: 300,
    fontSize: 30,
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,

    // Android TextInput has padding itself
    paddingTop: 0,
    paddingBottom: 0,
  },

  button: {
    height: 40,
    width: 200,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'gray',
  },
  buttonText: {
    fontSize: 24,
  }
})
