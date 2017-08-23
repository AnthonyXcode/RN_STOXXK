import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import styles from './styles'

export default class ControllerToggle extends Component {
    render() {
        const dataButtonStyle = this.props.showData ? styles.chosenButton : styles.regularButton
        const controllerStyle = this.props.showData ? styles.regularButton : styles.chosenButton
        return (
            <View style={styles.controllerContainer}>
                    <Text style={dataButtonStyle} onPress={this.props.toggleContent}>Data</Text>
                    <Text style={controllerStyle} onPress={this.props.toggleController}>Controller</Text>
            </View>
        )
    }
}  