import _ from 'lodash'

import _VIDEO_CONFIG from './module/VIDEO_CONFIG'
import _ENUM from'./module/ENUM'

import {locationParams} from './locationParams'
import {checkOSAlert, checkWebviewAlert, initRotateAlert, initAspectAlert} from './alert'
import {loader, drawFirstView} from './loader'
import {swipeVideo} from './swipeVideo'
import {drawAura} from './aura'
import {addTextCluster} from './textCluster'
import {chooseMode} from './chooseMode'
import {menuToggleBind, replayBtnBind} from './eventListener'
import {checkDebugMode} from './debugMode'

locationParams.debug = true

let phase = _ENUM.PHASE.LANDING
let textClusterArray = []
let firstSwipedFlag = false

const initSP = () => {
  const canvas = document.querySelector('.js-canvas')
  const videoDom = document.querySelector('.js-video-sprite')

  let x = canvas.offsetWidth
  let y = canvas.offsetHeight

  if (checkOSAlert() || checkWebviewAlert()) {
    return
  }
  initRotateAlert()
  initAspectAlert(canvas)

  loaderBind()
  videoDomBind(videoDom)
  swipeVideoBind(x, y)
  menuToggleBind()
  replayBtnBind()

  checkDebugMode(locationParams.debug, videoDom)

  startLoop(canvas, videoDom)
}

function drawSwipePrompt(ctx) {
  var PERIOD = 1500
  var MAX = 0.4

  var EASING = function EASING(x) {
    return Math.pow(x, 1 / 2)
  }

  var time = Date.now()
  var value = EASING(time % PERIOD / PERIOD) * MAX

  drawAura(value, ctx, swipeVideo)
}

function videoDomBind(videoDom) {
  const ending = document.querySelector('.js-ending')
  videoDom.addEventListener('ended', function () {
    ending.setAttribute('data-shown', true)
  })

  videoDom.addEventListener('timeupdate', function () {
    chooseMode(videoDom)
  })
}

function swipeVideoBind(x, y) {
  let firstPlayedFlag = false

  swipeVideo.on('tap', function (e) {
    textClusterArray = addTextCluster(_VIDEO_CONFIG.WIDTH * e.x / x, _VIDEO_CONFIG.HEIGHT * e.y / y)
  })

  swipeVideo.on('endSwipe', function () {
    if (!firstSwipedFlag) {
      firstSwipedFlag = true
    }
  })

  swipeVideo.on('start', function () {
    firstPlayedFlag = true
    loader.hide()
  })
  swipeVideo.setMode(_ENUM.MODE.GRAPH)

}

function loaderBind() {
  loader.on('complete', function () {
    // 読み込み時のscrollTopは無視したい
    document.body.scrollTop = 0
    if (phase < _ENUM.PHASE.LOADED) {
      phase = _ENUM.PHASE.LOADED
    }
  })
  loader.startLoading()
}

function startLoop(canvas, videoDom) {
  (function loop() {
    const ctx = canvas.getContext('2d')

    canvas.width = _VIDEO_CONFIG.WIDTH
    canvas.height = _VIDEO_CONFIG.HEIGHT

    swipeVideo.draw(ctx)

    if (phase <= _ENUM.PHASE.LOADED) {
      drawFirstView(videoDom, ctx)
    }

    switch (swipeVideo.mode) {
      case _ENUM.MODE.SWIPE:
        if (swipeVideo.fingerActive > 0) {
          // TODO: 判定インタフェース変えたい
          drawAura(swipeVideo.finger, ctx)
        } else if (_ENUM.PHASE.LOADED <= phase && !firstSwipedFlag) {
          drawSwipePrompt(ctx)
        }
        break
    }

    _.each(textClusterArray, function (textCluster) {
      textCluster.draw(ctx)
    })

    requestAnimationFrame(loop)
  })()
}

document.querySelector('body.sp') ? initSP() : null


