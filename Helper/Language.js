import I18n from 'react-native-i18n'
import Constant from './Constant'
I18n.fallbacks = true
I18n.translations = {
    en: {
        strategyOne: Constant.appConfig.isAdmin ? 'Cross RSI' : 'Strategy One',
        strategyTwo: Constant.appConfig.isAdmin ? 'Cross Moving' : 'Strategy Two',
        checkData: 'Check Data'
    },
    zh: {
        strategyOne: '策略 1',
        strategyTwo: '策略 2',
        checkData: '檢查數據'
    }
}

export default I18n