import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import styles from './styles'

export default class ControllerToggle extends Component {
    render() {
        console.log('toggleContent', this.props.toggleContent)
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