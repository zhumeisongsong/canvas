import _ENUM from'./module/ENUM'
import _VIDEO_CONFIG from './module/VIDEO_CONFIG'
import _Loader from './module/Loader'

const loadingDom = document.querySelector('.js-loading')

export const loader = new _Loader({
  root: loadingDom,
  value: document.querySelector('.js-loading-value')
})

export function drawFirstView(videoDom, ctx) {
  const FADE_TIME = 2
  let imgCache = {}

  if (!imgCache.firstView) {
    let img = new Image()
    img.src = './image/sp/loading_bg.png'
    imgCache.firstView = img
  }

  let currentTime = videoDom.currentTime

  if (currentTime < FADE_TIME) {
    ctx.save()
    ctx.globalAlpha = 1 - currentTime / FADE_TIME
    ctx.drawImage(imgCache.firstView, 0, 0, _VIDEO_CONFIG.WIDTH, _VIDEO_CONFIG.HEIGHT)
    ctx.restore()
  }
}

