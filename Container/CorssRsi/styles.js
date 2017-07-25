import { StyleSheet } from 'react-native'
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
    pageContainer: {
        flex: 1
    },
    flatList: {
        height: Metrix.height - Metrix.navigationBarHeight,
        width: Metrix.width
    }
})
