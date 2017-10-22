import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    View,
    FlatList,
    TouchableHighlight
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import CheckItem from '../../Component/CheckItem'
import styles from './styles'
import i18n from '../../Helper/Language'

const Pages = ['1']
const sortBy = require('ramda/src/sortBy')
const prop = require('ramda/src/prop')
const reverse = require('ramda/src/reverse')

export default class CheckData extends Component {
    constructor(props) {
        super(props)
    }

    static navigationOptions = {
        title: i18n.t('checkData')
    }

    render() {
        const { params } = this.props.navigation.state
        var sortByDate = sortBy(prop('date'))
        const items = reverse(sortByDate(params.items))
        return (
            <View style={{ flex: 1 }}>
                <CheckItem date={i18n.t('date')} high={i18n.t('high')} open={i18n.t('open')} low={i18n.t('low')} close={i18n.t('close')} />
                <FlatList
                    data={items}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => this.renderRow(item, index)}
                    initialScrollIndex={items.lenght}
                    removeClippedSubviews={true}
                    initialNumToRender={30}
                />
            </View>
        )
    }

    renderRow = (item, index) => {
        return (
            <CheckItem date={item.date} high={item.high} open={item.open} low={item.low} close={item.close} />
        )
    }

    onChangePage = () => {

    }
}