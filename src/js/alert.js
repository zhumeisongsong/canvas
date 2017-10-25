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

export const initRotateAlert = () => {
  const rotateAlert = document.querySelector('.js-rotate-alert')

  const update = function update() {
    rotateAlert.setAttribute('data-shown', window.innerWidth < window.innerHeight ? 'true' : 'false')
  }

  window.addEventListener('resize', update)
  setTimeout(update)
}

export const initAspectAlert = (canvas) => {
  const body = document.body
  const MAX_ASPECT = 1.85

  const update = function update() {
    const height = window.innerHeight
    const windowAspect = window.innerWidth / height
    body.setAttribute('data-low-height', windowAspect > MAX_ASPECT)
    canvas.style.top = -(canvas.offsetHeight - height) / 2 + 'px'
  }

  window.addEventListener('resize', update)
  setTimeout(update)
  setTimeout(update, 1000)
}
