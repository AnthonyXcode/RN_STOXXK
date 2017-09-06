import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    View,
    FlatList,
    TouchableHighlight,
    TextInput,
    Keyboard
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import styles from './styles'
import CrossRsiItem from '../../Component/CrossRsiItem'
import ControllerToggle from '../../Component/ControllerToggle'
import { prepareRsiData } from '../../Helper/CalculateHelper'

const sortBy = require('ramda/src/sortBy')
const prop = require('ramda/src/prop')
const reverse = require('ramda/src/reverse')
const merge = require('ramda/src/merge')
let items = []
let totalWin = 0
let totalTrade = 0
let winCount = 0
let lossCount = 0
let win = 0
let loss = 0

export default class CrossRsi extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shortRsi: 7,
            longRsi: 25,
            validRsi: 5,
            validDays: 6,
            cutlossValue: 400,
            showData: true
        }
    }
    static navigationOptions = {
        title: 'Cross RSI'
    }

    render() {
        return (
            <View>
                <ControllerToggle showData={this.state.showData} toggleContent={this.showContent} toggleController={this.showController} />
                {this.state.showData ? this.renderContent() : this.renderController()}
            </View>
        )
    }

    showContent = () => {
        this.setState({ showData: true })
    }

    showController = () => {
        this.setState({ showData: false })
    }

    renderContent = () => {
        const items = reverse(this.preparaData())
        return (
            <View style={styles.pageContainer}>
                <CrossRsiItem date={'Date'} longRsi={'Long'} shortRsi={'Short'} validRsi={this.state.validRsi} sell={'Sell'} buy={'Buy'} />
                <FlatList
                    data={items}
                    renderItem={({ item, index }) => this.renderListItem(item, index)}
                    keyExtractor={(item, index) => index}
                    style={styles.flatList}
                    removeClippedSubviews={true}
                />
            </View>
        )
    }

    renderController = () => {
        return (
            <TouchableHighlight onPress={Keyboard.dismiss} style={styles.pageContainer}>
                <View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.text}>Long Rsi: </Text>
                        <TextInput
                            defaultValue={this.state.longRsi.toString()}
                            keyboardType='number-pad'
                            style={styles.inputText}
                            placeholder={this.state.longRsi.toString()}
                            onChangeText={(text) => {
                                !!text && this.setState({ longRsi: parseInt(text) })
                            }}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.text}>Short Rsi: </Text>
                        <TextInput
                            defaultValue={this.state.shortRsi.toString()}
                            keyboardType='number-pad'
                            style={styles.inputText}
                            placeholder={this.state.shortRsi.toString()}
                            onChangeText={(text) => {
                                !!text && this.setState({ shortRsi: parseInt(text) })
                            }}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.text}>Valid Rsi: </Text>
                        <TextInput
                            defaultValue={this.state.validRsi.toString()}
                            keyboardType='number-pad'
                            style={styles.inputText}
                            placeholder={this.state.validRsi.toString()}
                            onChangeText={(text) => {
                                !!text && this.setState({ validRsi: parseInt(text) })
                            }}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.text}>Valid Days: </Text>
                        <TextInput
                            defaultValue={this.state.validDays.toString()}
                            keyboardType='number-pad'
                            style={styles.inputText}
                            placeholder={this.state.validDays.toString()}
                            onChangeText={(text) => {
                                text && this.setState({ validDays: parseInt(text) })
                            }}
                        />
                    </View>
                    <Text>
                        {'Total Win: '}{totalWin}{'\n'}
                        {'Total Trade: '}{totalTrade}{'\n'}
                        {'Win Count: '}{winCount}{'\n'}
                        {'Loss Count: '}{lossCount}{'\n'}
                        {'Win: '}{win}{'\n'}
                        {'Loss: '}{loss}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }

    renderListItem = (item, index) => {
        return (<CrossRsiItem
            date={item.date}
            longRsi={parseInt(item.longRsi)}
            shortRsi={parseInt(item.shortRsi)}
            validRsi={this.state.validRsi}
            sell={item.sell} buy={item.buy}
            wOrL={item.wOrL} />)
    }

    preparaData = () => {
        const { params } = this.props.navigation.state
        var sortByDate = sortBy(prop('date'))
        const inputItems = sortByDate(params.items)
        this.resetStaistic()
        return this.countBuyAndSell(prepareRsiData(inputItems, this.state.shortRsi, this.state.longRsi))
    }

    countBuyAndSell = (inputItems) => {
        const outputItem = []
        let buy = 0
        let buyOnHand = 0
        let sellOnHand = 0
        let sell = 0
        let buyLiquidationPosition = 0
        let sellLiquidationPosition = 0
        let wOrL = 0

        for (var i = 20; i < inputItems.length; i++) {
            const previousItem = inputItems[i - 1]
            const item = inputItems[i]
            buy = 0
            sell = 0
            wOrL = 0
            if (buyLiquidationPosition !== 0) {
                if (item.shortRsi < item.longRsi || i === buyLiquidationPosition || item.close < buyOnHand - this.state.cutlossValue) {
                    buyLiquidationPosition = 0
                    sell = item.close
                    wOrL = sell - buyOnHand
                    this.getStatistic(wOrL)
                }
                outputItem.push(merge(inputItems[i], { sell, buy, wOrL }))
                continue
            }

            if (sellLiquidationPosition !== 0) {
                if (item.shortRsi > item.longRsi || i === sellLiquidationPosition || item.close > sellOnHand + this.state.cutlossValue) {
                    sellLiquidationPosition = 0
                    buy = item.close
                    wOrL = sellOnHand - buy
                    this.getStatistic(wOrL)
                }
                outputItem.push(merge(inputItems[i], { sell, buy, wOrL }))
                continue
            }

            if (previousItem.shortRsi < previousItem.longRsi && item.shortRsi - this.state.validRsi >= item.longRsi) {
                buy = item.close
                buyOnHand = item.close
                buyLiquidationPosition = i + this.state.validDays
            }

            if (previousItem.shortRsi > previousItem.longRsi && item.shortRsi + this.state.validRsi <= item.longRsi) {
                sell = item.close
                sellOnHand = item.close
                sellLiquidationPosition = i + this.state.validDays
            }
            outputItem.push(merge(inputItems[i], { sell, buy, wOrL }))
        }
        return outputItem
    }

    resetStaistic = () => {
        totalTrade = 0
        totalWin = 0
        win = 0
        loss = 0
        winCount = 0
        lossCount = 0
    }

    getStatistic = (wOrL) => {
        totalWin += wOrL
        if (wOrL > 0) {
            win += wOrL
            winCount += 1
        } else {
            loss += wOrL
            lossCount += 1
        }
        totalTrade += 1
    }
}