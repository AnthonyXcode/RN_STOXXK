import { StyleSheet } from 'react-native'
import CommonStyles from '../../Themes/CommonStyles'
import Metrix from '../../Themes/Metrix'

export default StyleSheet.create({
    ...CommonStyles,
    container: {
        flexDirection: 'row',
        height: 30,
        width: Metrix.width,
        alignItems: 'center'
    },
    date: {
        flex: 1.7
    },
    data: {
        flex: 1
    }
})