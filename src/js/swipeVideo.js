import _VIDEO_CONFIG from './module/VIDEO_CONFIG'
import {SwipeVideo} from './module/SwipeVideo'

const canvas = document.querySelector('.js-canvas')
const videoDom = document.querySelector('.js-video-sprite')

export const swipeVideo = new SwipeVideo({
  canvas: canvas,
  video: videoDom,
  src: _VIDEO_CONFIG.SRC,
  width: _VIDEO_CONFIG.WIDTH,
  height: _VIDEO_CONFIG.HEIGHT
})