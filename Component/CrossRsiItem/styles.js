import { StyleSheet } from 'react-native'
import CommonStyles from '../../Themes/CommonStyles'

export default StyleSheet.create({
    ...CommonStyles,
    container: {
        flexDirection: 'row',
        height: 30
    },
    date: {
        flex: 1.5
    },
    data: {
        flex: 1
    }
})