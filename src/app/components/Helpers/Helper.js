export function currentStakeableDay() {
    return (new Date().getTime() - 1666675257679) / 86400000
}
export function addDays(date, days) {
    var result = new Date(date).getTime();
    let newTImeStamp = result + days * 24 * 60 * 60 * 1000;
    // console.log("result.getDate()", newTImeStamp);
    return new Date(newTImeStamp);;
}
export function toDaysMinutesSeconds(totalSeconds) {
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const days = Math.floor(totalSeconds / (3600 * 24));

    const secondsStr = makeHumanReadable(seconds, 'second');
    const minutesStr = makeHumanReadable(minutes, 'minute');
    const hoursStr = makeHumanReadable(hours, 'hour');
    const daysStr = makeHumanReadable(days, 'day');

    return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`.replace(/,\s*$/, '');
}

export function makeHumanReadable(num, singular) {
    return num > 0
        ? num + (num === 1 ? ` ${singular}, ` : ` ${singular}s, `)
        : '';
}




export function convertToIntArray(hex) {
    console.log("hex", hex);
    if (hex != undefined) {
        let array = [];
        let indexedVal = '';
        for (let index = 1; index < hex.length; index++) {
            // if (hex[index] >= 0 && hex[index] <= 9)
            if (hex[index] == ',' || hex[index] == ']') {
                console.log("indexedVal", indexedVal);
                array.push(parseInt(indexedVal))
                indexedVal = ""
            } else {

                indexedVal = indexedVal + hex[index]
                console.log("hex[index]", hex[index]);
            }
        }
        return array
    }
}
export function toHex(hex) {
    console.log("hex", hex);
    let result = "";
    if (hex != undefined) {
      let array = [];
      let indexedVal = '';
      for (let index = 1; index < hex.length; index++) {
        // if (hex[index] >= 0 && hex[index] <= 9)
        if (hex[index] == ',' || hex[index] == ']') {

          console.log("indexedVal", indexedVal);
          array.push(parseInt(indexedVal))
          indexedVal = ""
        } else {

          indexedVal = indexedVal + hex[index]
          console.log("hex[index]", hex[index]);
        }
      }
      console.log("array", array);
      for (let index = 1; index < array.length; index = index + 1) {
        result = result.concat(parseInt(array[index], 10).toString(16));
      }
    }
    return result
  }