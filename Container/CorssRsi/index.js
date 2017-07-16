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
import ViewPager from 'react-native-viewpager'
import styles from './styles'
import CrossRsiItem from '../../Component/CrossRsiItem'

const Pages = ['1', '2', '3']
const sortBy = require('ramda/src/sortBy')
const prop = require('ramda/src/prop')
const reverse = require('ramda/src/reverse')
const merge = require('ramda/src/merge')
let totalWin = 0

export default class CrossRsi extends Component {
    constructor(props) {
        super(props)
        const ds = new ViewPager.DataSource({ pageHasChanged: (r1, r2) => r1 !== r2 })
        this.state = {
            dataSource: ds.cloneWithPages(Pages),
            shortRsi: 7,
            longRsi: 25,
            validRsi: 5,
            validDays: 6,
            cutlossValue: 400
        }
    }
    static navigationOptions = {
        title: 'Cross RSI'
    }

    render() {
        return (
            <ViewPager
                dataSource={this.state.dataSource}
                renderPage={(item, index) => this.renderPage(item, index)}
                isLoop={false}
                autoPlay={false}
            />
        )
    }

    renderPage = (item, index) => {
        if (index == 0) {
            const items = reverse(this.preparaData())
            return (<View style={{ flex: 1 }}>
                <CrossRsiItem date={'Date'} longRsi={'Long'} shortRsi={'Short'} validRsi={this.state.validRsi} sell={'Sell'} buy={'Buy'} />
                <FlatList
                    data={items}
                    renderItem={({ item, index }) => this.renderListItem(item, index)}
                    keyExtractor={(item, index) => index}
                />
            </View>)
        } else if (index == 1) {
            return (
                    <View style={{ flex: 1 }}>
                        <View style={styles.rowContainer}>
                            <Text style={styles.text}>Long Rsi: </Text>
                            <TextInput
                                defaultValue={this.state.longRsi.toString()}
                                keyboardType='number-pad'
                                style={styles.inputText}
                                placeholder={this.state.longRsi.toString()}
                                onChangeText={(text) => {
                                    this.setState({ longRsi: parseInt(text) })
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
                                    this.setState({ shortRsi: parseInt(text) })
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
                                    this.setState({ validRsi: parseInt(text) })
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
                                    this.setState({ validDays: parseInt(text) })
                                }}
                            />
                        </View>
                    </View>
            )
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Text>{totalWin}</Text>
                </View>)
        }
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
        const outputItems = []

        console.log('data: ', params.items)

        let totalRaise = 0
        let totalDrop = 0

        for (var i = 0; i < inputItems.length; i++) {
            if (i == this.state.shortRsi - 1) {
                const item = this.initRsi(inputItems, this.state.shortRsi, true)
                outputItems.push(item)
            }

            if (i > this.state.shortRsi) {
                const previousItem = inputItems[i - 1]
                const item = inputItems[i]
                const outputShortItem = this.countRsiItemForShort(previousItem, item, outputItems[outputItems.length - 1], this.state.shortRsi)

                if (i > this.state.shortRsi - 1 && i < this.state.longRsi - 1) {
                    outputItems.push(...outputShortItem)
                } else if (i === this.state.longRsi - 1) {
                    const item = this.initRsi(inputItems, this.state.longRsi, false)
                    outputItems.push(merge(item, outputShortItem))
                } else if (i > this.state.longRsi - 1) {
                    const outputLongItem = this.countRsiItemForLong(previousItem, item, outputItems[outputItems.length - 1], this.state.longRsi)
                    outputItems.push(merge(outputShortItem, outputLongItem))
                }
            }
        }

        console.log('output: ', outputItems)
        return this.countBuyAndSell(outputItems)
    }

    initRsi = (items, days, isShort) => {
        let totalRaise = 0
        let totalDrop = 0
        for (var i = 0; i < items.length; i++) {
            if (i == days - 1) break
            let difference = items[i + 1].close - items[i].close
            if (difference > 0) {
                totalRaise += difference
            } else {
                totalDrop += Math.abs(difference)
            }
        }

        let rsi = (totalRaise / (totalRaise + totalDrop)) * 100
        let raiseAverage = totalRaise / days
        let dropAverage = totalDrop / days

        if (isShort) {
            return { ...items[days], shortRsi: rsi, raiseShortAverage: raiseAverage, dropShortAverage: dropAverage }
        } else {
            return { ...items[days], longRsi: rsi, raiseLongAverage: raiseAverage, dropLongAverage: dropAverage }
        }
    }

    countRsiItemForShort = (previousItem, item, outputPreviousItem, days) => {
        let difference = item.close - previousItem.close
        let outputItem = {}

        let raiseAverage = 0
        let dropAverage = 0
        if (difference > 0) {
            raiseAverage = ((outputPreviousItem.raiseShortAverage * (days - 1)) + difference) / days
            dropAverage = outputPreviousItem.dropShortAverage * (days - 1) / days
        } else {
            raiseAverage = outputPreviousItem.raiseShortAverage * (days - 1) / days
            dropAverage = (outputPreviousItem.dropShortAverage * (days - 1) + Math.abs(difference)) / days
        }
        const rsi = (raiseAverage / (raiseAverage + dropAverage)) * 100
        const output = { ...item, shortRsi: rsi, raiseShortAverage: raiseAverage, dropShortAverage: dropAverage }
        return output
    }

    countRsiItemForLong = (previousItem, item, outputPreviousItem, days) => {
        let difference = item.close - previousItem.close
        let outputItem = {}

        let raiseAverage = 0
        let dropAverage = 0
        if (difference > 0) {
            raiseAverage = ((outputPreviousItem.raiseLongAverage * (days - 1)) + difference) / days
            dropAverage = outputPreviousItem.dropLongAverage * (days - 1) / days
        } else {
            raiseAverage = outputPreviousItem.raiseLongAverage * (days - 1) / days
            dropAverage = (outputPreviousItem.dropLongAverage * (days - 1) + Math.abs(difference)) / days
        }
        const rsi = (raiseAverage / (raiseAverage + dropAverage)) * 100
        const output = { ...item, longRsi: rsi, raiseLongAverage: raiseAverage, dropLongAverage: dropAverage }
        return output
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
        totalWin = 0
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
                    totalWin += wOrL
                }
                outputItem.push(merge(inputItems[i], { sell, buy, wOrL }))
                continue
            }

            if (sellLiquidationPosition !== 0) {
                if (item.shortRsi > item.longRsi || i === sellLiquidationPosition || item.close > sellOnHand + this.state.cutlossValue) {
                    sellLiquidationPosition = 0
                    buy = item.close
                    wOrL = sellOnHand - buy
                    totalWin += wOrL
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
}