const merge = require('ramda/src/merge')


export const prepareRsiData = (inputItems, shortRsi, longRsi) => {
    const outputItems = []

    let totalRaise = 0
    let totalDrop = 0

    for (var i = 0; i < inputItems.length; i++) {
        if (i == shortRsi - 1) {
            const item = this.initRsi(inputItems, shortRsi, true)
            outputItems.push(item)
        }

        if (i > shortRsi) {
            const previousItem = inputItems[i - 1]
            const item = inputItems[i]
            const outputShortItem = this.countRsiItemForShort(previousItem, item, outputItems[outputItems.length - 1], shortRsi)

            if (i > shortRsi - 1 && i < longRsi - 1) {
                outputItems.push(...outputShortItem)
            } else if (i === longRsi - 1) {
                const item = this.initRsi(inputItems, longRsi, false)
                outputItems.push(merge(item, outputShortItem))
            } else if (i > longRsi - 1) {
                const outputLongItem = this.countRsiItemForLong(previousItem, item, outputItems[outputItems.length - 1], longRsi)
                outputItems.push(merge(outputShortItem, outputLongItem))
            }
        }
    }

    return outputItems
}

initRsi = (items, days, isShort) => {
    let totalRaise = 0
    let totalDrop = 0
    for (var i = 0; i < items.length; i++) {
        if (i == days - 1) break
        let difference = items[i + 1].close - items[i].close
        if (difference > 0) {
            totalRaise += difference
        } else {
            totalDrop += Math.abs(difference)
        }
    }

    let rsi = (totalRaise / (totalRaise + totalDrop)) * 100
    let raiseAverage = totalRaise / days
    let dropAverage = totalDrop / days

    if (isShort) {
        return { ...items[days], shortRsi: rsi, raiseShortAverage: raiseAverage, dropShortAverage: dropAverage }
    } else {
        return { ...items[days], longRsi: rsi, raiseLongAverage: raiseAverage, dropLongAverage: dropAverage }
    }
}

countRsiItemForShort = (previousItem, item, outputPreviousItem, days) => {
    let difference = item.close - previousItem.close
    let outputItem = {}

    let raiseAverage = 0
    let dropAverage = 0
    if (difference > 0) {
        raiseAverage = ((outputPreviousItem.raiseShortAverage * (days - 1)) + difference) / days
        dropAverage = outputPreviousItem.dropShortAverage * (days - 1) / days
    } else {
        raiseAverage = outputPreviousItem.raiseShortAverage * (days - 1) / days
        dropAverage = (outputPreviousItem.dropShortAverage * (days - 1) + Math.abs(difference)) / days
    }
    const rsi = (raiseAverage / (raiseAverage + dropAverage)) * 100
    const output = { ...item, shortRsi: rsi, raiseShortAverage: raiseAverage, dropShortAverage: dropAverage }
    return output
}

countRsiItemForLong = (previousItem, item, outputPreviousItem, days) => {
    let difference = item.close - previousItem.close
    let outputItem = {}

    let raiseAverage = 0
    let dropAverage = 0
    if (difference > 0) {
        raiseAverage = ((outputPreviousItem.raiseLongAverage * (days - 1)) + difference) / days
        dropAverage = outputPreviousItem.dropLongAverage * (days - 1) / days
    } else {
        raiseAverage = outputPreviousItem.raiseLongAverage * (days - 1) / days
        dropAverage = (outputPreviousItem.dropLongAverage * (days - 1) + Math.abs(difference)) / days
    }
    const rsi = (raiseAverage / (raiseAverage + dropAverage)) * 100
    const output = { ...item, longRsi: rsi, raiseLongAverage: raiseAverage, dropLongAverage: dropAverage }
    return output
}