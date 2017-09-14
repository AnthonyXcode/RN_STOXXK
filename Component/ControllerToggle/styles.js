import { StyleSheet } from 'react-native'
import CommonStyles from '../../Themes/CommonStyles'
import Metrix from '../../Themes/Metrix'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
    controllerContainer: {
        flexDirection: 'row',
        height: Metrix.controllerHeight,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    chosenButton: {
        ...CommonStyles.chosenBackground,
        flex: 1,        
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    regularButton: {
        ...CommonStyles.regularBackground,
        flex: 1,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftButton: {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderWidth: 1,
        borderColor: Colors.darkSkyBlue2
    },
    rightBottom: {
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: 1,
        borderColor: Colors.darkSkyBlue2
    },
    text: {
        flex: 1,  
        lineHeight: 30,
        textAlign: 'center',        
    }
})