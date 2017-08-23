import { StyleSheet } from 'react-native'
import CommonStyles from '../../Themes/CommonStyles'
import Metrix from '../../Themes/Metrix'

export default StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50
    },
    text: {
        width: 100,
        textAlign: 'right',
    },
    inputText: {
        width: 200,
        alignSelf: 'center',
    },
    contentContainer: {
        height: Metrix.height - Metrix.controllerHeight
    }
})
