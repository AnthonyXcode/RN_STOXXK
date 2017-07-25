import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import styles from './styles'

export default class CrossMAItem extends Component {
    render() {
        const { date, longMA, shortMA, middleMA, buy, sell, wOrL } = this.props
        const buyStyle =  !buy ? styles.buyBackground : null
        const sellStyle = !sell ? styles.sellBackground : null
        return (
            <View style={[styles.container, buyStyle, sellStyle]}>
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.data}>{buy}</Text>
                <Text style={styles.data}>{sell}</Text>
                <Text style={styles.data}>{wOrL}</Text>
            </View>
        )
    }
}  