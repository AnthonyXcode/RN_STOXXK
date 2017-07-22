import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    View,
    FlatList,
    TouchableHighlight
} from 'react-native';
import styles from './styles'

export default class HomeItem extends Component {
    onPress = () => {
        this.props.onItemPress(this.props.data.name)
    }
    
    render() {
        return(
            <TouchableHighlight onPress={this.onPress}>
                <View style={styles.container}>
                    <Text>{this.props.data.name}</Text>
                </View>                
            </TouchableHighlight>
        )
    }
}