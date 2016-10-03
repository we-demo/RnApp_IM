import React, { Component } from 'react'
import {
  StyleSheet, Text, View, Image,
} from 'react-native'

export default class Message extends Component {
  render () {
    const { user, text, color } = this.props.message
    return (
      <View>
        <Text style={[styles.text, { color }]}>
          {user.name}
          {': '}
          {text}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  }
})
