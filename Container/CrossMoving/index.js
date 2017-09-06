import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    View,
    FlatList,
    TouchableWithoutFeedback,
    TextInput,
    Keyboard
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import CrossMAItme from '../../Component/CrossMAItme'
import styles from './styles'
import { prepareRsiData } from '../../Helper/CalculateHelper'
import ControllerToggle from '../../Component/ControllerToggle'

const sortBy = require('ramda/src/sortBy')
const prop = require('ramda/src/prop')
const reverse = require('ramda/src/reverse')
const mergeAll = require('ramda/src/mergeAll')
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
            showData: true,
            shortMoving: 5,
            middleMoving: 10,
            longMoving: 25,
            validDays: 2,
            cutlossValue: 200,
            cutWinValue: 1000
        }
    }

    static navigationOptions = {
        title: 'Cross Moving'
    }

    render() {
        return (
            <View>
                <ControllerToggle
                    showData={this.state.showData}
                    toggleContent={this.showContent}
                    toggleController={this.showController} />
                {this.renderContent()}
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
        const outputItems = this.prepareData()
        return (
            <View style={styles.contentContainer}>
                {
                    this.state.showData &&
                        <CrossMAItme date={'Data'} longMA={'Long'} middleMA={'Middle'} shortMA={'Short'} buy={'Buy'} sell={'Sell'} wOrL={'wOrL'} />
                        <FlatList
                            data={outputItems}
                            renderItem={({ item, index }) => this.renderListItem(item, index)}
                            keyExtractor={(item, index) => index}
                            removeClippedSubviews={true}
                        />
                }
                {!this.state.showData && this.renderInputText()}
            </View>
        )
    }

    renderInputText = () => {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.pageContainer}>
                <View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.text}>Short Moving: </Text>
                        <TextInput
                            defaultValue={this.state.shortMoving.toString()}
                            keyboardType='number-pad'
                            style={styles.inputText}
                            placeholder={this.state.shortMoving.toString()}
                            onChangeText={(text) => {
                                !!text && this.setState({ shortMoving: parseInt(text) })
                            }}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.text}>Middle Moving: </Text>
                        <TextInput
                            defaultValue={this.state.middleMoving.toString()}
                            keyboardType='number-pad'
                            style={styles.inputText}
                            placeholder={this.state.middleMoving.toString()}
                            onChangeText={(text) => {
                                !!text && parseInt(text) > this.state.shortMoving && this.setState({ middleMoving: parseInt(text) })
                            }}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.text}>Long Moving: </Text>
                        <TextInput
                            defaultValue={this.state.longMoving.toString()}
                            keyboardType='number-pad'
                            style={styles.inputText}
                            placeholder={this.state.longMoving.toString()}
                            onChangeText={(text) => {
                                !!text && parseInt(text) > this.state.middleMoving && this.setState({ longMoving: parseInt(text) })
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
                    <View style={styles.rowContainer}>
                        <Text style={styles.text}>Cut Loss Value: </Text>
                        <TextInput
                            defaultValue={this.state.cutlossValue.toString()}
                            keyboardType='number-pad'
                            style={styles.inputText}
                            placeholder={this.state.cutlossValue.toString()}
                            onChangeText={(text) => {
                                text && this.setState({ cutlossValue: parseInt(text) })
                            }}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.text}>Cut Win Value: </Text>
                        <TextInput
                            defaultValue={this.state.cutWinValue.toString()}
                            keyboardType='number-pad'
                            style={styles.inputText}
                            placeholder={this.state.cutWinValue.toString()}
                            onChangeText={(text) => {
                                text && this.setState({ cutWinValue: parseInt(text) })
                            }}
                        />
                    </View>
                    <Text>
                        {'Total Win: '}{totalWin}
                        {'\nTotal trade: '}{totalTrade}
                        {'\nWin Count: '}{winCount}
                        {'\nLoss Count: '}{lossCount}
                        {'\nWin Value: '}{win}
                        {'\nLoss Value: '}{loss}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    prepareData = () => {
        const { params } = this.props.navigation.state
        var sortByDate = sortBy(prop('date'))
        const inputItems = sortByDate(params.items)
        this.resetStaistic()
        let outputItems = []
        for (var i = 0; i < inputItems.length; i++) {
            let item = outputItems[i]
            if (i > this.state.longMoving) {
                const shortMA = this.countMA(inputItems, i, 'short', this.state.shortMoving)
                const middleMA = this.countMA(inputItems, i, 'middle', this.state.middleMoving)
                const longMA = this.countMA(inputItems, i, 'long', this.state.longMoving)
                item = mergeAll([shortMA, middleMA, longMA])
                outputItems.push(item)
            }
        }
        outputItems = this.applyStrategy(outputItems)
        outputItems = reverse(outputItems)
        return outputItems
    }

    countMA = (items, position, type, days) => {
        let sum = 0
        for (var i = 0; i < days; i++) {
            sum += items[position - i].close
        }
        sum = sum / days
        switch (type) {
            case 'short':
                return { ...items[position], shortMA: parseInt(sum) }
            case 'middle':
                return { ...items[position], middleMA: parseInt(sum) }
            case 'long':
                return { ...items[position], longMA: parseInt(sum) }
            default:
                return { ...items[position] }
        }
    }

    applyStrategy = (inputItems) => {
        const outputItems = []
        let buyOnhand = 0
        let sellOnhand = 0
        let laquidationDay = 0

        for (var i = 1; i < inputItems.length; i++) {
            const previousItem = inputItems[i - 1]
            const item = inputItems[i]
            let wOrL = 0
            let sell = 0
            let buy = 0

            if (buyOnhand != 0) {
                if (i >= laquidationDay) {
                    wOrL = item.close - buyOnhand
                    sell = item.close
                    this.getStatistic(wOrL)
                    buyOnhand = 0
                    laquidationDay = 0
                } else if (item.close - buyOnhand > this.state.cutWinValue || buyOnhand - item.close > this.state.cutlossValue) {
                    wOrL = item.close - buyOnhand
                    sell = item.close
                    this.getStatistic(wOrL)
                    buyOnhand = 0
                    laquidationDay = 0
                }
                const outputItem = { ...item, buy, sell, wOrL }
                outputItems.push(outputItem)
                continue
            }

            if (sellOnhand != 0) {
                if (i === laquidationDay) {
                    wOrL = sellOnhand - item.close
                    buy = item.close
                    this.getStatistic(wOrL)
                    sellOnhand = 0
                    laquidationDay = 0
                } else if (sellOnhand - item.close > this.state.cutWinValue || item.close - sellOnhand > this.state.cutlossValue) {
                    wOrL = sellOnhand - item.close
                    buy = item.close
                    this.getStatistic(wOrL)
                    sellOnhand = 0
                    laquidationDay = 0
                }
                const outputItem = { ...item, buy, sell, wOrL }
                outputItems.push(outputItem)
                continue
            }

            if (previousItem.shortMA > previousItem.longMA + 150) {
                buyOnhand = item.close
                buy = item.close
                laquidationDay = i + this.state.validDays
            }

            if (previousItem.shortMA < previousItem.longMA - 150) {
                sellOnhand = item.close
                sell = item.close
                laquidationDay = i + this.state.validDays
            }

            const outputItem = { ...item, buy, sell, wOrL }
            outputItems.push(outputItem)
        }
        return outputItems
    }

    renderListItem = (item, index) => {
        return (
            <CrossMAItme date={item.date} longMA={item.longMA} middleMA={item.middleMA} shortMA={item.shortMA} buy={item.buy} sell={item.sell} wOrL={item.wOrL} />
        )
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