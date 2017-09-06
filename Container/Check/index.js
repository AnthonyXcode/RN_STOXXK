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
import CheckItem from '../../Component/CheckItem'
import styles from './styles'

const Pages = ['1']
const sortBy = require('ramda/src/sortBy')
const prop = require('ramda/src/prop')
const reverse = require('ramda/src/reverse')

export default class CheckData extends Component {
    constructor(props) {
        super(props)
        const ds = new ViewPager.DataSource({ pageHasChanged: (r1, r2) => r1 !== r2 })
        this.state = {
            dataSource: ds.cloneWithPages(Pages),
        }
    }

    static navigationOptions = {
        title: 'Check Data'
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
            var sortByDate = sortBy(prop('date'))
            const items = reverse(sortByDate(params.items))
            return (
                <View style={{ flex: 1 }}>
                    <CheckItem date={'Date'} high={'High'} open={'Open'} low={'Low'} close={'Close'} />
                    <FlatList data={items}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item, index }) => this.renderRow(item, index)}
                        initialScrollIndex={items.lenght}
                        removeClippedSubviews={true}
                    />
                </View>
            )
        }
    }

    renderRow = (item, index) => {
        return (
            <CheckItem date={item.date} high={item.high} open={item.open} low={item.low} close={item.close} />
        )
    }

    onChangePage = () => {

    }
}