import React, { Component } from 'react'
import {
  StyleSheet, Text, View, Image,
} from 'react-native'

export default class Message extends Component {
  render () {
    return (
      <View>
        <Text style={styles.text}>
          {this.props.message.user.name}
          {': '}
          {this.props.message.text}
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
