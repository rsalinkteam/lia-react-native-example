import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid
} from 'react-native';

import MessageRow from './components/MessageRow';

import SdkManager from './manager/SdkManager';

export default class MessageBrowserScreen extends Component {

  static navigationOptions = {
    title: 'Messages'
  };

  constructor(props) {
    super(props);
    this.sdk = SdkManager.get();
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    Promise.all([
      this.sdk.client.messages({
        board: 'board:CrossDeviceDemo'
      })
    ]).then(responses => {
      const messages = [];
      responses.forEach((response) => {
        response.data.data.items.forEach((item => messages.push(item)))
      });
      this.setState({
        messages
      })
    }).catch(this.error);
  }

  error (response) {
    ToastAndroid.show(`${response}`, ToastAndroid.SHORT);
  }

  read () {
    this.props.navigation.navigate('Message');
  }

  render() {
    return (
      <View style={styles.flex}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.container}>
          {
            this.state.messages.map(message => {
              return <MessageRow key={message.id} message={message} onPress={this.read.bind(this)}/>
            })
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flex: 1
  },
  title: {
    fontSize: 18,
    padding: 12,
    color: '#171717'
  }
});