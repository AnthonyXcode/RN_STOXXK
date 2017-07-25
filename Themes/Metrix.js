import { Dimensions, Platform } from 'react-native'

const navigationBarHeight= Platform.OS === 'ios' ? 64 : 54

const Metrix = {
    width: Dimensions.width,
    height: Dimensions.height,
    navigationBarHeight: navigationBarHeight
} 

export default Metrix