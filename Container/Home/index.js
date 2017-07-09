/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    View,
    FlatList,
    TouchableHighlight,
    Alert
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import styles from './styles'
import CheckData from '../Check'
import HomeItem from '../../Component/HomeItem'
import * as firebase from 'firebase';

const rowItem = [{ name: 'Check Data' }, { name: 'Cross RSI' }, { name: 'Cross Moving' }, { name: 'KDJ' }]

const firebaseConfig = {
    apiKey: "AIzaSyDUInXBnBUXikaYaSX2TzqCI8KY4QZ1knw",
    authDomain: "sharelocaton.firebaseapp.com",
    databaseURL: "https://sharelocaton.firebaseio.com",
    projectId: "sharelocaton",
    storageBucket: "sharelocaton.appspot.com",
    messagingSenderId: "947519844086"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);


export default class HomeScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataReady: false,
            allData: {},
            dataArray: []
        }
    }

    static navigationOptions = {
        title: 'Home',
    }

    componentDidMount() {
        var database = firebaseApp.database().ref('Date Data')
        var data = {}
        var items = []
        var oneString = database.on('value', (snapShot) => {
            data = snapShot.val()
            for (var year in data) {
                const yearData = data[year]
                for (var month in yearData) {
                    const monthData = yearData[month]
                    for (var day in monthData) {
                        const dayData = monthData[day]
                        console.log('day: ' + year + '-' + month + '-' + day + ": " + dayData)
                        const item = {
                            year: year,
                            month: month,
                            day: day,
                            data: dayData
                        }
                        items.push(item)
                    }
                }
            }
            this.setState({
                dataArray: items,
                allData: data,
                dataReady: true
            })
        })
    }

    render() {
        const signal = this.state.dataReady ? 'Data is ready!' : 'Preparing data!'
        return (
            <View>
                <FlatList
                    data={rowItem}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => this.renderRow(item, index)} />
                <View style={styles.signal}>
                    <Text>{signal}</Text>
                </View>
            </View>
        );
    }

    renderRow = (data, index) => {
        return (
            <HomeItem onItemPress={this.onItemPress}
                data={data} />
        )
    }

    onItemPress = (name) => {
        if (this.state.dataReady) {
            switch (name) {
                case 'Check Data':
                    this.props.navigation.navigate('CheckData', { allData: this.state.allData, items: this.state.dataArray })
            }
        } else {
            Alert.alert('Data are still not ready!', null, [{ text: 'OK', onPress: () => console.log('OK Pressed') }], { cancelable: true })
        }
    }
}

const RN_Stock = StackNavigator({
    Home: { screen: HomeScreen },
    CheckData: { screen: CheckData }
});

AppRegistry.registerComponent('RN_Stock', () => RN_Stock);
