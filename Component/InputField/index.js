import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput
} from 'react-native';
import styles from './styles'

export default class InputField extends Component {
    render() {
        return (
            <View style={styles.rowContainer}>
                <Text style={styles.text}>{this.props.title}</Text>
                <TextInput
                    defaultValue={this.props.defaultValue}
                    keyboardType='number-pad'
                    style={styles.inputText}
                    placeholder={this.props.placeholder}
                    onChangeText={this.props.onChangeText}
                />
            </View>
        )
    }
}