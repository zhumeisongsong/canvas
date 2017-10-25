import _VIDEO_CONFIG from './module/VIDEO_CONFIG'
import _SwipeVideo from'./module/SwipeVideo'

const canvas = document.querySelector('.js-canvas')
const videoDom = document.querySelector('.js-video-sprite')

export const swipeVideo = new _SwipeVideo({
  canvas: canvas,
  video: videoDom,
  src: _VIDEO_CONFIG.SRC,
  width: _VIDEO_CONFIG.WIDTH,
  height: _VIDEO_CONFIG.HEIGHT
})