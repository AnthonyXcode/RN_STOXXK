import I18n from 'react-native-i18n'
import Constant from './Constant'
I18n.fallbacks = true
I18n.translations = {
    en: {
        home: 'Home',
        strategyOne: Constant.appConfig.isAdmin ? 'Cross RSI' : 'Strategy One',
        strategyTwo: Constant.appConfig.isAdmin ? 'Cross Moving' : 'Strategy Two',
        checkData: 'Check Data',
        dataReady: 'Data is ready',
        preparingData: 'Preparing data',
        record: 'Record',
        data: 'Data',
        wOrL: 'Win',
        buy: 'Buy',
        sell: 'Sell',
        date: 'Date',
        high: 'High',
        open: 'Open',
        low: 'Low',
        close: 'close',
        totalWin: 'Total Win: ',
        totalTrade: 'Total Trade: ',
        winCount: 'Win Count: ',
        lossCount: 'Loss Count: ',
        win: 'Win: ',
        loss: 'Loss: ',
        dataAreStillNotReady: 'Data are still not ready!'
    },
    zh: {
        home: '主頁',
        strategyOne: '策略 1',
        strategyTwo: '策略 2',
        checkData: '檢查數據',
        dataReady: '完成下載',
        preparingData: '正在下載數據',
        record: '記錄',
        data: '數據',
        wOrL: '賺蝕',
        buy: '買',
        sell: '賣',
        date: '日期',
        high: '高',
        open: '開',
        low: '低',
        close: '收',
        totalWin: '贏取點數: ',
        totalTrade: '交易次數: ',
        winCount: '盈利次數: ',
        lossCount: '虧損次數: ',
        win: '盈利: ',
        loss: '虧損: ',
        dataAreStillNotReady: '數據準備中!'        

    }
}

export default I18n