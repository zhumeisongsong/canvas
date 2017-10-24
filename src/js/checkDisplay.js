import  _UA from './module/UA'

export const checkOSAlert = () => {
  const iOSLimit = 9
  if (_UA.isIOS && _UA.iOSVersion < iOSLimit) {
    document.querySelector('.js-os-alert').style.display = 'block';
    return true
  } else {
    return false
  }
}

export const checkWebviewAlert = () => {
  if (_UA.isWebview) {
    document.querySelector('.js-webview-alert').style.display = 'block';
    return true
  } else {
    return false
  }
}


