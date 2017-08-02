import { StyleSheet } from 'react-native'
import CommonStyles from '../../Themes/CommonStyles'

export default StyleSheet.create({
    controllerContainer: {
        flexDirection: 'row',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    chosenButton: {
        ...CommonStyles.chosenBackground,
        flex: 1, 
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        lineHeight: 30
    },
    regularButton: {
        ...CommonStyles.regularBackground,
        flex: 1,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        lineHeight: 30
    }
})