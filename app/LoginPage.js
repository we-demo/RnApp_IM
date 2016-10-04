import React, { Component } from 'react'
import {
  StyleSheet,
  Text, TextInput, View,
} from 'react-native'
import Chance from 'chance'
import Button from 'apsl-react-native-button'
import ws from './ws'

const noop = () => {}
const chance = new Chance()

export default class LoginPage extends Component {
  constructor () {
    super()
    this.state = {
      ready: false,
      name: chance.first()
    }

    // self binding
    ;[
      'handleWsOpen', 'handleTextChange',
      'handleSubmit', 'handlePress'
    ].forEach((method) => {
      this[method] = this[method].bind(this)
    })
  }

  componentDidMount () {
    ws.addListener('open', this.handleWsOpen)
    console.log('this.state', this.state)
  }
  componentWillUnmount () {
    ws.removeListener('open', this.handleWsOpen)
  }
  handleWsOpen () {
    this.setState({ ready: true })
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
    const { name, ready } = this.state
    // if (!ready) return

    const user = { name: name.trim() }

    ws.send({
      id: chance.guid(),
      user,
      type: 'serverJOIN'
    })

    this.props.onLogin(user)
  }

  render () {
    return (
      <View style={styles.bg}>
        <View style={styles.container}>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.input}
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
    paddingTop: 20,
    flex: 1,
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
