import _querystring from 'querystring'
import _lodash from 'lodash'
import _SwipeVideo from'./module/SwipeVideo'
import _TextCluster from'./module/TextCluster'
import _SpriteAnime from './module/SpriteAnime'
import _Loader from './module/Loader'
import _VIDEO_CONFIG from './module/VIDEO_CONFIG'
import _SPRITE_ANIME_CONFIG from'./module/SPRITE_ANIME_CONFIG'
import _VIDEO_CHAPTER from'./module/VIDEO_CHAPTER'
import _ENUM from'./module/ENUM'

const MAX_TEXT_CLUSTER = 3;

var videoDom = document.querySelector('.js-video-sprite');
var loadingDom = document.querySelector('.js-loading');
var startBtn = document.querySelector('.js-start-btn');
var modeBtn = document.querySelector('.js-mode-btn');
var shuffleBtn = document.querySelector('.js-shuffle-btn');
var skipIntroBtn = document.querySelector('.js-skip-intro-btn');
var skipSongBtn = document.querySelector('.js-skip-song-btn');
var replayBtn = document.querySelector('.js-replay');
var menuToggle = document.querySelector('.js-menu-toggle');
var ending = document.querySelector('.js-ending');
var canvas = document.querySelector('.js-canvas');
var ctx = canvas.getContext('2d');

var textClusterArray = [];

var auraAnime = new _SpriteAnime(_SPRITE_ANIME_CONFIG.AURA);

var loader = new _Loader({
  root: loadingDom,
  value: document.querySelector('.js-loading-value')
});

var imgCache = {};

var swipeVideo = void 0;
var phase = _ENUM.PHASE.LANDING;
var firstPlayedFlag = false;
var firstSwipedFlag = false;

import {checkOSAlert,checkWebviewAlert} from './checkDisplay';

const initSP = () => {
  if (checkOSAlert || checkWebviewAlert) {
    return;
  }

  checkDebugMode();

  initSwipeVideo();
  initRotateAlert();
  initAspectAlert();
  initListeners();

  swipeVideo.setMode(_ENUM.MODE.SWIPE);
  auraAnime.initImage();
  auraAnime.start();
  startLoop();

  loader.startLoading();
}

function initSwipeVideo() {
  swipeVideo = new _SwipeVideo({
    canvas: canvas,
    video: videoDom,
    src: _VIDEO_CONFIG.SRC,
    width: _VIDEO_CONFIG.WIDTH,
    height: _VIDEO_CONFIG.HEIGHT
  });
}

function initRotateAlert() {
  var rotateAlert = document.querySelector('.js-rotate-alert');
  var update = function update() {
    rotateAlert.setAttribute('data-shown', window.innerWidth < window.innerHeight ? 'true' : 'false');
  };

  window.addEventListener('resize', update);
  setTimeout(update);
}

function initAspectAlert() {
  var body = document.body;
  // const MAX_ASPECT = 1.8; // iPhone7の最大
  var MAX_ASPECT = 1.85; // ゆるめ

  var update = function update() {
    var height = window.innerHeight;
    var windowAspect = window.innerWidth / height;
    body.setAttribute('data-low-height', windowAspect > MAX_ASPECT);
    canvas.style.top = -(canvas.offsetHeight - height) / 2 + 'px';
  };

  window.addEventListener('resize', update);
  setTimeout(update);
  setTimeout(update, 1000);
}

function initListeners() {
  startBtn.addEventListener('click', function () {
    swipeVideo.togglePlay();
  });

  modeBtn.addEventListener('click', function () {
    swipeVideo.setMode(swipeVideo.mode == _ENUM.MODE.SWIPE ? _ENUM.MODE.PAINT : _ENUM.MODE.SWIPE);
    updateModeBtn();
  });

  shuffleBtn.addEventListener('click', function () {
    swipeVideo.incrementSprite();
  });

  skipIntroBtn.addEventListener('click', function () {
    videoDom.currentTime = _VIDEO_CHAPTER.INTRO;
  });

  skipSongBtn.addEventListener('click', function () {
    videoDom.currentTime = videoDom.duration - 3;
  });

  menuToggle.addEventListener('click', function () {
    var isOpend = document.body.getAttribute('data-menu-opend') == 'true';
    document.body.setAttribute('data-menu-opend', isOpend ? 'false' : 'true');
    document.body.scrollTop = 0;
    if (isOpend) {
      swipeVideo.startVideo();
    } else {
      swipeVideo.pauseVideo();
    }
  });

  replayBtn.addEventListener('click', function () {
    swipeVideo.restartVideo();
    ending.setAttribute('data-shown', false);
  });

  videoDom.addEventListener('canplaythrough', function () {
    locationParams.debug && console.log('[can play through]');
  });

  videoDom.addEventListener('ended', function () {
    ending.setAttribute('data-shown', true);
  });

  videoDom.addEventListener('timeupdate', function () {
    chooseMode();
  });

  swipeVideo.on('tap', function (e) {
    locationParams.debug && console.log('[tap]', [e.x, e.y]);
    addTextCluster(_VIDEO_CONFIG.WIDTH * e.x / canvas.offsetWidth, _VIDEO_CONFIG.HEIGHT * e.y / canvas.offsetHeight);
  });

  swipeVideo.on('endSwipe', function () {
    if (!firstSwipedFlag) {
      firstSwipedFlag = true;
    }
  });

  swipeVideo.on('changeSprite', function (e) {
    // dev
    shuffleBtn.innerHTML = e.index + 1;
  });

  swipeVideo.on('changeMode', updateModeBtn);

  swipeVideo.on('start', function () {
    startBtn.innerHTML = 'pause';
    firstPlayedFlag = true;
    loader.hide();
  });

  swipeVideo.on('pause', function () {
    startBtn.innerHTML = 'start';
  });

  loader.on('complete', function () {
    // 読み込み時のscrollTopは無視したい
    document.body.scrollTop = 0;
    if (phase < _ENUM.PHASE.LOADED) {
      phase = _ENUM.PHASE.LOADED;
    }
  });
}

function startLoop() {
  (function loop() {
    canvas.width = _VIDEO_CONFIG.WIDTH;
    canvas.height = _VIDEO_CONFIG.HEIGHT;

    swipeVideo.draw(ctx);

    if (phase <= _ENUM.PHASE.LOADED) {
      drawFirstView();
    }

    switch (swipeVideo.mode) {
      case _ENUM.MODE.SWIPE:
        /*
         if (PHASE.LOADED <= phase && !firstSwipedFlag) {
         drawSwipePrompt(ctx);
         } else {
         drawAura(swipeVideo.finger);
         }
         */
        if (swipeVideo.fingerActive > 0) {
          // TODO: 判定インタフェース変えたい
          drawAura(swipeVideo.finger);
        } else if (_ENUM.PHASE.LOADED <= phase && !firstSwipedFlag) {
          drawSwipePrompt(ctx);
        }
        break;
    }

    _lodash.each(textClusterArray, function (textCluster) {
      textCluster.draw(ctx);
    });

    requestAnimationFrame(loop);
  })();
}

function drawSwipePrompt(ctx) {
  var PERIOD = 1500;
  var MAX = 0.4;

  var EASING = function EASING(x) {
    return Math.pow(x, 1 / 2);
  };

  var time = Date.now();
  var value = EASING(time % PERIOD / PERIOD) * MAX;

  drawAura(value);
}

function drawAura(pos) {
  var scale = _VIDEO_CONFIG.HEIGHT / auraAnime.cellHeight;
  var xOffset = 0.45;

  ctx.save();
  ctx.globalAlpha = swipeVideo.fingerActive;
  if (swipeVideo.swipeType == _ENUM.SWIPE_TYPE.PREV) {
    ctx.translate(_VIDEO_CONFIG.WIDTH * pos + auraAnime.cellWidth * xOffset, _VIDEO_CONFIG.HEIGHT * 0.5);
    ctx.scale(scale, scale);
  } else {
    ctx.translate(_VIDEO_CONFIG.WIDTH * pos - auraAnime.cellWidth * xOffset, _VIDEO_CONFIG.HEIGHT * 0.5);
    ctx.scale(-scale, scale);
  }
  auraAnime.draw(ctx);
  ctx.restore();
}

function addTextCluster(x, y) {
  var textCluster = new _TextCluster({
    width: _VIDEO_CONFIG.WIDTH,
    height: _VIDEO_CONFIG.HEIGHT
  });
  textCluster.start([x, y]);

  while (textClusterArray.length >= MAX_TEXT_CLUSTER) {
    textClusterArray.shift();
  }
  textClusterArray.push(textCluster);
}

function drawFirstView() {
  var FADE_TIME = 2;

  if (!imgCache.firstView) {
    var img = new Image();
    img.src = './image/sp/loading_bg.png';
    imgCache.firstView = img;
  }

  var currentTime = videoDom.currentTime;

  if (currentTime < FADE_TIME) {
    ctx.save();
    ctx.globalAlpha = 1 - currentTime / FADE_TIME;
    ctx.drawImage(imgCache.firstView, 0, 0, _VIDEO_CONFIG.WIDTH, _VIDEO_CONFIG.HEIGHT);
    ctx.restore();
  }
}

function chooseMode() {
  var seconds = videoDom.currentTime;
  if (seconds < _VIDEO_CHAPTER.BMELO) {
    // INTRO, AMELO
    swipeVideo.setMode(_ENUM.MODE.SWIPE);
  } else if (seconds < _VIDEO_CHAPTER.SABI1) {
    // BMELO
    swipeVideo.setMode(_ENUM.MODE.PAINT);
  } else if (seconds < _VIDEO_CHAPTER.SABI2) {
    // SABI1
    swipeVideo.setMode(_ENUM.MODE.SWIPE);
  } else if (seconds < _VIDEO_CHAPTER.OUTRO) {
    // SABI2
    swipeVideo.setMode(_ENUM.MODE.PAINT);
  } else {
    // OUTRO
    swipeVideo.setMode(_ENUM.MODE.SWIPE);
  }
}

function updateModeBtn() {
  modeBtn.innerHTML = swipeVideo.mode;
}

document.addEventListener('DOMContentLoaded', function (e) {
  document.querySelector('body.sp') ? initSP() : null
})

