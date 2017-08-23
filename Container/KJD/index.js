import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    View,
    FlatList,
    TouchableWithoutFeedback,
    ViewPagerAndroid,
    TextInput,
    ScrollView,
    Platform,
    Keyboard,
    Dimensions,
    Image
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import CrossMAItme from '../../Component/CrossMAItme'
import styles from './styles'
import { prepareRsiData } from '../../Helper/CalculateHelper'
import Metrix from '../../Themes/Metrix'

const sortBy = require('ramda/src/sortBy')
const prop = require('ramda/src/prop')
const reverse = require('ramda/src/reverse')
const mergeAll = require('ramda/src/mergeAll')
let items = ['abc', 'def']
let totalWin = 0
let totalTrade = 0
let winCount = 0
let lossCount = 0
let win = 0
let loss = 0

export default class KJD extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    static navigationOptions = {
        title: 'KJD'
    }

    render() {
        if (Platform.OS === 'ios') {
            return this.renderIOS()
        } else {
            return this.renderAndroid()
        }
    }

    renderIOS() {
        return (
            <View style={{ flex: 1, backgroundColor: 'red' }}>
            </View>
        )
    }

    renderAndroid() {

    }

    renderContent() {
        const imgStyle = { backgroundColor: "red" }
        return items.map((item, index) => {
            return index === 0
                ? <Image style={[{ width: Dimensions.width, height: Dimensions.height }, imgStyle]} />
                : <Text>{item}</Text>
        })
    }

    handleHorizontalScroll() {

    }
    adjustCardSize() {

    }
}