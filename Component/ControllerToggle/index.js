import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableHighlight
} from 'react-native';
import styles from './styles'
import i18n from '../../Helper/Language'

export default class ControllerToggle extends Component {
    render() {
        const dataButtonStyle = this.props.showData ? styles.chosenButton : styles.regularButton
        const controllerStyle = this.props.showData ? styles.regularButton : styles.chosenButton
        const dataTextStyle = this.props.showData ? [styles.chosenText, styles.text] : styles.text
        const controllerTextStyle = this.props.showData ? styles.text : [styles.chosenText, styles.text]
        return (
            <View style={styles.controllerContainer}>
                <TouchableHighlight style={styles.button} onPress={this.props.toggleContent}>
                    <View style={[styles.leftButton, dataButtonStyle]}>
                        <Text style={dataTextStyle} >{i18n.t('record')}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.button} onPress={this.props.toggleController}>
                    <View style={[styles.rightBottom, controllerStyle]}>
                        <Text style={controllerTextStyle}>{i18n.t('data')}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}  