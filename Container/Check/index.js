import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    View,
    FlatList,
    TouchableHighlight
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import ViewPager from 'react-native-viewpager'
import styles from './styles'

const Pages = ['1', '2', '3']

export default class CheckData extends Component {
    constructor(props) {
        super(props)
        const ds = new ViewPager.DataSource({ pageHasChanged: (r1, r2) => r1 !== r2 })
        this.state = {
            dataSource: ds.cloneWithPages(Pages),
            allData: []
        }
    }

    static navigationOptions = {
        title: 'Check Data'
    }

    componentDidMount() {
        const { params } = this.props.navigation.state
        const allData = params.allData
        const data = []
        for (var year in allData) {
            const monthData = allData[year]
            for (var month in monthData) {
                const dayData = monthData[month]
                for (var day in dayData) {
                    const item = {
                        day: { year },
                        month: { month },
                        day: { day }
                    }
                    // data.push(item)
                }
            }
        }
        console.log('sizs', data.length)
        this.setState({ allData: data })
    }

    render() {
        return (
            <ViewPager
                dataSource={this.state.dataSource}
                renderPage={(item, index) => this.renderPage(item, index)}
                onChangePage={this.onChangePage}
                isLoop={false}
                autoPlay={false}
            />
        )
    }

    renderPage = (item, index) => {
        if (index == 0) {
            const { params } = this.props.navigation.state
            const items = params.items
            return (
                <View style={{ flex: 1 }}>
                    <FlatList data={items}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item, index }) => this.renderRow(item, index)}
                        ListHeaderComponent={this.renderHeader()}
                    />
                </View>
            )
        } else if (index == 1) {
            return (
                <View style={{ flex: 1 }}>
                    <Text>{item}</Text>
                    <Text>{index}</Text>
                </View>
            )
        } else if (index == 2) {
            return (
                <View>
                </View>
            )
        }
    }

    renderHeader = () => {
        return (
            <View>
                <Text>Date</Text>
            </View>
        )
    }

    renderRow = (item, index) => {
        console.log('index: ' + index)
        console.log('day: ' + item)
        return (
            <View>
                <Text>{item.day}</Text>
            </View>
        )
    }

    onChangePage = () => {

    }
}