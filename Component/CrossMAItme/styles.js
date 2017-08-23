import { StyleSheet } from 'react-native'
import CommonStyles from '../../Themes/CommonStyles'
import Metrix from '../../Themes/Metrix'

export default StyleSheet.create({
    ...CommonStyles,
    container: {
        flexDirection: 'row',
        height: Metrix.controllerHeight,
        width: Metrix.width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    date: {
        flex: 1.7
    },
    data: {
        flex: 1
    }
})