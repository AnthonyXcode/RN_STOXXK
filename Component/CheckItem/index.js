import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import styles from './styles'

export default class HomeItem extends Component {
    render() {
        const {date, high, open, low, close} = this.props
        return (
        <View style={styles.container}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.data}>{high}</Text>
          <Text style={styles.data}>{open}</Text>
          <Text style={styles.data}>{low}</Text>
          <Text style={styles.data}>{close}</Text>
        </View>
        )
    }
}  