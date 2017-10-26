import _VIDEO_CHAPTER from'./module/VIDEO_CHAPTER'
import _ENUM from'./module/ENUM'

import {swipeVideo} from './swipeVideo'

export const checkDebugMode = (isDebug, videoDom) => {
  const startBtn = document.querySelector('.js-start-btn')
  const modeBtn = document.querySelector('.js-mode-btn')
  const shuffleBtn = document.querySelector('.js-shuffle-btn')
  const skipIntroBtn = document.querySelector('.js-skip-intro-btn')
  const skipSongBtn = document.querySelector('.js-skip-song-btn')

  if (isDebug) {
    document.querySelector('.js-debug-ui').style.display = "block"

    startBtn.addEventListener('click', function () {
      swipeVideo.togglePlay()
    })
    modeBtn.addEventListener('click', function () {
      swipeVideo.setMode(swipeVideo.mode == _ENUM.MODE.SWIPE ? _ENUM.MODE.PAINT : _ENUM.MODE.SWIPE)
      modeBtn.innerHTML = swipeVideo.mode
    })
    shuffleBtn.addEventListener('click', function () {
      swipeVideo.incrementSprite()
    })
    skipIntroBtn.addEventListener('click', function () {
      videoDom.currentTime = _VIDEO_CHAPTER.BMELO
    })
    skipSongBtn.addEventListener('click', function () {
      videoDom.currentTime = videoDom.duration - 3
    })

    swipeVideo.on('start', function () {
      startBtn.innerHTML = 'pause'
    })
    swipeVideo.on('pause', function () {
      startBtn.innerHTML = 'start'
    })
    swipeVideo.on('changeMode', () => {
      modeBtn.innerHTML = swipeVideo.mode
    })
    swipeVideo.on('changeSprite', function (e) {
      shuffleBtn.innerHTML = e.index + 1
    })
    swipeVideo.on('tap', function (e) {
      isDebug && console.log('[tap]', [e.x, e.y])
    })

    videoDom.addEventListener('canplaythrough', function () {
      isDebug && console.log('[can play through]')
    })
  }

}