const ua = navigator.userAgent
const isIOS = /iphone|ipod|ipad/i.test(ua)
const isAndroid = /android/i.test(ua)

const iOSVersion = isIOS ? function () {
    let matchData = ua.match(/OS ([0-9]+)/)
    if (matchData) {
      return parseInt(matchData[1])
    } else {
      return null
    }
  }() : null

export default{
  isIOS: isIOS,
  iOSVersion: iOSVersion,
  isAndroid: isAndroid,
  isSP: isIOS || isAndroid,
  isWebview: isIOS && /twitter|fbav|line/i.test(ua)
}