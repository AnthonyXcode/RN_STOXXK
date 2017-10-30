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
import styles from './styles'
import CrossRsiItem from '../../Component/CrossRsiItem'
import ControllerToggle from '../../Component/ControllerToggle'
import { prepareRsiData } from '../../Helper/CalculateHelper'
import Constant from '../../Helper/Constant'
import i18n from '../../Helper/Language'

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

export default class DMI extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showData: true
        }
    }
    static navigationOptions = {
        title: 'DMI'
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
            </View>
        )
    }

    renderController = () => {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.dataContainer}>
                    {Constant.appConfig.isAdmin ? <View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.text}>Long Rsi: </Text>
                            <TextInput
                                keyboardType='number-pad'
                                style={styles.inputText}
                            />
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.text}>Short Rsi: </Text>
                            <TextInput
                                keyboardType='number-pad'
                                style={styles.inputText}
                            />
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.text}>Valid Rsi: </Text>
                            <TextInput
                                keyboardType='number-pad'
                                style={styles.inputText}
                            />
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.text}>Valid Days: </Text>
                            <TextInput
                                keyboardType='number-pad'
                                style={styles.inputText}
                            />
                        </View>
                    </View> : null}
                    <Text>
                        {i18n.t('totalWin')}{totalWin}{'\n'}
                        {i18n.t('totalTrade')}{totalTrade}{'\n'}
                        {i18n.t('winCount')}{winCount}{'\n'}
                        {i18n.t('lossCount')}{lossCount}{'\n'}
                        {i18n.t('win')}{win}{'\n'}
                        {i18n.t('loss')}{loss}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderListItem = (item, index) => {
        return (<View></View>)
    }

    //http://jesse0606.pixnet.net/blog/post/32688093-%E6%8A%80%E8%A1%93%E6%8C%87%E6%A8%99dmi
    preparaData = () => {
        const { params } = this.props.navigation.state
        var sortByDate = sortBy(prop('date'))
        const inputItems = sortByDate(params.items)
        this.resetStaistic()
        const includeTR = this.insertTR(inputItems, 14)
        const includeDM = this.insertDM(includeTR, 14)
        const includeDI = this.insertDI(includeDM, 14)
        const includeADX = this.insertADX(includeDI, 14)
        console.log(includeADX)
        return inputItems
    }

    /*    
      TR（True Range）為波動實值，其算法為取以下三值中的最大一值，如下:
      (1)、為當日最高價減去當日最低價。
      (2)、∣Ht-C(t－1)∣ 為當日最高價減去前一日收盤價的絕對值。
      (3)、∣C(t－1)-Lt∣為前一日收盤價減去當日最低價絕對值。
      公式TR＝MAX(Ht-Lt，∣Ht-C(t－1)∣，∣C(t－1)-Lt∣)
      可簡化為 TR=MAX(Ht,Lt,前日收) - MIN(Ht,Lt,前日收)
      再計算 TR(14)：起始值計算取前14根做平均數，之後使用「KD式平滑法」如前述，如下：
      當日TR(14)＝前一日TR14*(13/14) + 今日TR*(1/14)
    */
    insertTR = (inputItems, averageDay) => {
        const outputItems = []
        for (var i = 0; i < inputItems.length; i++) {
            if (i < 1) {
                outputItems.push(inputItems[i])
            } else {
                const range = inputItems[i].high - inputItems[i].low
                const absHC = Math.abs(inputItems[i].high - inputItems[i - 1].close)
                const absCL = Math.abs(inputItems[i - 1].close - inputItems[i].low)
                const TR = Math.max(range, absHC, absCL)
                if (i < averageDay) {
                    outputItems.push({ ...inputItems[i], TR })
                } else if (i === averageDay) {
                    let sum = TR
                    for (var j = 1; j < averageDay; j++) {
                        sum += outputItems[j].TR
                    }
                    const ATR = sum / averageDay
                    outputItems.push({ ...inputItems[i], ATR, TR })
                } else {
                    const ATR = outputItems[i - 1].ATR * (averageDay - 1) / averageDay + TR / averageDay
                    outputItems.push({ ...inputItems[i], ATR, TR })
                }
            }
        }
        return outputItems
    }

    /*
      2.計算DM值：包括+DM{正趨向變動值} 及 -DM{負趨向變動值}
　　     須計算「+DM」、「-DM」、「真實+DM」、「真實-DM」、「+DM(14)」、「–DM(14)」
　　     1. 把當日最高價減去前一日最高價 = +DM。
　　     2. 前一日最低價減去當日最低價 = -DM。
　　     3. 若+DM>-DM成立，且+DM大於0，則「真實+DM」= +DM，若+DM小於等於0，則「真實+DM」= 0。
　　     4. 同理，若+DM<-DM且-DM大於0，則「真實-DM」= -DM，若-DM小於等於0，則「真實-DM」= 0。
　　     5. 接下來計算 +DM(14)與 –DM(14)之值。
　　     起始值：可先用前14天之「真實+DM」的平均數做為第一天之+DM(14)，用前14天之「真實-DM」的平均數做為第一天之-DM(14)，而後計算如下：
　　        當日+DM(14)＝前一日+DM(14)*(13/14) + 當日真實+DM*(1/14)
　　        當日-DM(14)＝前一日 -DM14*(13/14) + 當日真實 -DM*(1/14)
    */

    insertDM = (inputItems, averageDay) => {
        const outputItems = []
        for (var i = 0; i < inputItems.length; i++) {
            if (i < 1) {
                outputItems.push(inputItems[i])
            } else {
                const positiveDM = inputItems[i].high - inputItems[i - 1].high
                const negativeDM = inputItems[i - 1].low - inputItems[i].low
                let truePstDM = 0
                let trueNgtDM = 0

                if (positiveDM > negativeDM && positiveDM > 0){
                    truePstDM = positiveDM
                }

                if (positiveDM < negativeDM && negativeDM > 0){
                    trueNgtDM = negativeDM
                }

                if (i < averageDay) {
                    outputItems.push({ ...inputItems[i], positiveDM, negativeDM, trueNgtDM, truePstDM })
                } else if (i === averageDay) {
                    let sumPositiveDM = positiveDM
                    let sumNegationDM = negativeDM
                    let sumTruePstDM = truePstDM
                    let sumTrueNgtDM = trueNgtDM
                    let count = 0
                    for (var j = 1; j < outputItems.length; j++) {
                        sumPositiveDM += outputItems[j].positiveDM
                        sumNegationDM += outputItems[j].negativeDM
                        sumTruePstDM += outputItems[j].truePstDM
                        sumTrueNgtDM += outputItems[j].trueNgtDM
                        count += 1
                    }
                    const AvgPstDM = sumPositiveDM / averageDay
                    const AvgNgtDM = sumNegationDM / averageDay
                    const AvgTruePstDM = sumTruePstDM / averageDay
                    const AvgTrueNgtDM = sumTrueNgtDM / averageDay
                    outputItems.push({ ...inputItems[i], positiveDM, negativeDM, truePstDM, trueNgtDM, AvgPstDM, AvgNgtDM, AvgTruePstDM, AvgTrueNgtDM })
                } else {
                    const AvgPstDM = outputItems[i - 1].AvgTruePstDM * (averageDay - 1) / averageDay + positiveDM / averageDay
                    const AvgNgtDM = outputItems[i - 1].AvgTrueNgtDM * (averageDay - 1) / averageDay + negativeDM / averageDay
                    const AvgTruePstDM = outputItems[i - 1].AvgTruePstDM * (averageDay - 1) / averageDay + truePstDM / averageDay
                    const AvgTrueNgtDM = outputItems[i - 1].AvgTrueNgtDM * (averageDay - 1) / averageDay + trueNgtDM / averageDay                    
                    outputItems.push({ ...inputItems[i], positiveDM, negativeDM, truePstDM, trueNgtDM, AvgPstDM, AvgNgtDM, AvgTruePstDM, AvgTrueNgtDM })
                }
            }
        }
        return outputItems
    }
    /*
     3. 計算DI值
　　     +DI(14)＝+DM(14)/ TR(14) * 100
　　     -DI(14)＝-DM(14)/ TR(14) * 100
    */
    insertDI = (inputItems, averageDay) => {
        const outputItems = []
        for (var i = 0; i < inputItems.length; i++) {
            const AvgPstDM = prop(['AvgPstDM'], inputItems[i])
            const AvgNgtDM = prop(['AvgNgtDM'], inputItems[i])
            const ATR = prop(['ATR'], inputItems[i])
            if (AvgPstDM && AvgNgtDM && ATR) {
                const AvgPstDI = AvgPstDM / ATR * 100
                const AvgNgtDI = AvgNgtDM / ATR * 100
                outputItems.push({ ...inputItems[i], AvgPstDI, AvgNgtDI })
            } else {
                outputItems.push(inputItems[i])
            }
        }
        return outputItems
    }

    /*
      4. 計算DX及ADX
　　     ADX（趨向平均線）是用來判別14日內價格變動趨勢的明顯度，計算如下：
　　     先取DX值：DX＝∣(+DI 14)- (-DI14)∣/ ((+DI14)+ (-DI14)) * 100。
　　     再取ADX值：起始值計算比照DM(14)之計算方式，取前14根做平均數。
　     　當日ADX(14)＝前一日ADX*(13/14) + 今日DX*(1/14)
    */

    insertADX = (inputItems, averageDay) => {
        const outputItems = []
        for (var i = 0; i < inputItems.length; i++) {
            if (i < averageDay) {
                outputItems.push(inputItems[i])
            } else {
                const AvgPstDI = prop(['AvgPstDI'], inputItems[i])
                const AvgNgtDI = prop(['AvgNgtDI'], inputItems[i])
                const DX = Math.abs(AvgPstDI - AvgNgtDI) / (AvgPstDI + AvgNgtDI) * 100
                if (i < 2 * averageDay) {
                    outputItems.push({ ...inputItems[i], DX })
                } else if (i == 2 * averageDay) {
                    const ADX = DX
                    for (var j = averageDay + 1; j < averageDay * 2; j++) {
                        ADX += prop(['DX'], outputItems[j])
                    }
                    ADX = ADX / averageDay
                    outputItems.push({ ...inputItems[i], DX, ADX })
                } else {
                    const ADX = outputItems[i - 1].ADX * (averageDay - 1) / averageDay + DX / averageDay
                    outputItems.push({ ...inputItems[i], DX, ADX })
                }
            }
        }
        return outputItems
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