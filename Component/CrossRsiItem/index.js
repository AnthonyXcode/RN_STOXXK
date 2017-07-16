import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import styles from './styles'

export default class CrossRsiItem extends Component {
    render() {
        const { date, longRsi, shortRsi, buy, sell, wOrL, validRsi } = this.props
        let stateStyle={}
        if (shortRsi > longRsi ){
            stateStyle=styles.buyBackground
        }
        if (shortRsi  < longRsi){
            stateStyle=styles.sellBackground
        }
        return (
            <View style={[styles.container, stateStyle]}>
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.data}>{longRsi}</Text>
                <Text style={styles.data}>{shortRsi}</Text>
                <Text style={styles.data}>{buy}</Text>
                <Text style={styles.data}>{sell}</Text>
                <Text style={styles.data}>{wOrL}</Text>
            </View>
        )
    }
}  