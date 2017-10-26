import _events from'events'
import _ from'lodash'
import _UA from'./UA'
import _ENUM from'./ENUM'

const _slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
const _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

const INTERVAL = 20;
const PAINT_WIDTH = 50;
const PAINT_MAX_SCALE = 4;

export const SwipeVideo = function (_EventEmitter) {
  _inherits(SwipeVideo, _EventEmitter);

  function SwipeVideo() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SwipeVideo);

    var _this = _possibleConstructorReturn(this, (SwipeVideo.__proto__ || Object.getPrototypeOf(SwipeVideo)).call(this));

    _this.canvas = opts.canvas || document.createElement('canvas');
    _this.video = opts.video || document.createElement('video');
    _this.width = isNaN(opts.width) ? 0 : opts.width;
    _this.height = isNaN(opts.height) ? 0 : opts.height;
    _this.src = opts.src;

    _this.spriteIndex = 0;
    _this.mode = null;
    _this.swipeType = null;
    _this.tapPos = null;
    _this.finger = 0;
    _this.fingerActive = 0;
    _this.dragFlag = false;
    _this.autoSwipeFlag = false;
    _this.paintArray = [];
    _this.paintCanvas = document.createElement('canvas');
    _this.paintCtx = _this.paintCanvas.getContext('2d');

    _this.initSpriteConfig();
    _this.initListeners();
    _this.initVideo();
    return _this;
  }

  _createClass(SwipeVideo, [
      {
        key: 'initSpriteConfig',
        value: function initSpriteConfig() {
          this.spriteConfig = [{
            x1: 0,
            y1: 0,
            x2: this.width,
            y2: this.height
          }, {
            x1: this.width,
            y1: 0,
            x2: this.width * 2,
            y2: this.height
          }, {
            x1: 0,
            y1: this.height,
            x2: this.width,
            y2: this.height * 2
          }, {
            x1: this.width,
            y1: this.height,
            x2: this.width * 2,
            y2: this.height * 2
          }];
        }
      },
      {
        key: 'initListeners',
        value: function initListeners() {
          var _this2 = this;

          if (_UA.isSP) {
            this.canvas.addEventListener('touchstart', function (e) {
              _this2.handlePointerStart(e);
            });
            this.canvas.addEventListener('touchmove', function (e) {
              _this2.handlePointerMove(e);
            });
            this.canvas.addEventListener('touchend', function (e) {
              _this2.handlePointerEnd(e);
            });
          } else {
            this.canvas.addEventListener('mousedown', function (e) {
              _this2.dragFlag = true;
              _this2.handlePointerStart(e);
            });
            this.canvas.addEventListener('mouseup', function (e) {
              if (_this2.dragFlag) {
                _this2.dragFlag = false;
                _this2.handlePointerEnd(e);
              }
            });
            this.canvas.addEventListener('mousemove', function (e) {
              if (_this2.dragFlag) {
                _this2.handlePointerMove(e);
              }
            });
          }

        }
      },
      {
        key: 'initVideo',
        value: function initVideo() {
          this.video.setAttribute('playsinline', 'playsinline');
          this.video.setAttribute('src', this.src);
        }
      },
      {
        key: 'setMode',
        value: function setMode(mode) {
          if (this.mode === mode) {
            return;
          }
          this.mode = mode;
          this.emit('changeMode', {
            mode: mode
          });
        }
      },
      {
        key: 'handlePointerStart',
        value: function handlePointerStart(e) {
          if (this.autoSwipeFlag) {
            return;
          }

          switch (this.mode) {
            case _ENUM.MODE.PAINT:
              this.clearPaint();
              break;

            case _ENUM.MODE.GRAPH:
              this.clearPaint()
              break
          }

          this.tapPos = this.getPointerPosition(e);

          // やや荒っぽいけど、touchstartに入れたい
          this.startVideo();
        }
      },
      {
        key: 'handlePointerMove',
        value: function handlePointerMove(e) {
          e.preventDefault();

          if (this.autoSwipeFlag) {
            return;
          }

          var _getPointerPosition = this.getPointerPosition(e),
            _getPointerPosition2 = _slicedToArray(_getPointerPosition, 2),
            pageX = _getPointerPosition2[0],
            pageY = _getPointerPosition2[1];

          switch (this.mode) {
            case _ENUM.MODE.SWIPE:
              this.handleSwipe(pageX);
              // 右側から始めたときは、indexを戻す挙動 => いったんdecrementする
              if (this.tapPos) {
                if (this.finger > 0.5) {
                  this.decrementSprite();
                  this.swipeType = _ENUM.SWIPE_TYPE.PREV;
                } else {
                  this.swipeType = _ENUM.SWIPE_TYPE.NEXT;
                }
                this.fingerActive = 1;
                this.emit('startSwipe');
              }
              break;

            case _ENUM.MODE.PAINT:
              this.handlePaint(this.width * pageX / this.canvas.offsetWidth, this.height * pageY / this.canvas.offsetHeight);
              break;

            case _ENUM.MODE.GRAPH:
              this.handlePaint(this.width * pageX / this.canvas.offsetWidth, this.height * pageY / this.canvas.offsetHeight);
              break;
          }

          this.tapPos = null;
        }
      },
      {
        key: 'handlePointerEnd',
        value: function handlePointerEnd(e) {
          var _this3 = this;

          if (this.autoSwipeFlag) {
            return;
          }

          if (this.tapPos) {
            this.emit('tap', {
              x: this.tapPos[0],
              y: this.tapPos[1]
            });
          } else {
            switch (this.mode) {
              case _ENUM.MODE.SWIPE:
                this.roundSwipeFinger();
                this.emit('endSwipe');
                break;

              case _ENUM.MODE.PAINT:
                this.scaleUpPaint(undefined, function () {
                  _this3.incrementSprite();
                });
                break;

              case _ENUM.MODE.GRAPH:
                this.scaleUpPaint(undefined, function () {
                  _this3.incrementSprite();
                });
                break;
            }
          }

          this.tapPos = null;
        }
      },
      {
        key: 'getPointerPosition',
        value: function getPointerPosition(e) {
          var scrollTop = document.body.scrollTop + this.canvas.offsetTop;
          return [e.touches && e.touches[0] ? e.touches[0].pageX : e.pageX, (e.touches && e.touches[0] ? e.touches[0].pageY : e.pageY) - scrollTop];
        }
      },
      {
        key: 'handleSwipe',
        value: function handleSwipe(x) {
          this.finger = x / this.canvas.offsetWidth;
        }
      },
      {
        key: 'handlePaint',
        value: function handlePaint(x, y) {
          this.paintArray.push([x, y]);
        }
      },
      {
        key: 'setSpriteIndex',
        value: function setSpriteIndex(index) {
          this.spriteIndex = (index + this.spriteConfig.length) % this.spriteConfig.length;
          this.emit('changeSprite', {
            index: this.spriteIndex
          });
        }
      },
      {
        key: 'incrementSprite',
        value: function incrementSprite() {
          this.setSpriteIndex(this.spriteIndex + 1);
        }
      },
      {
        key: 'decrementSprite',
        value: function decrementSprite() {
          this.setSpriteIndex(this.spriteIndex - 1);
        }
      },
      {
        key: 'roundSwipeFinger',
        value: function roundSwipeFinger() {
          var _this4 = this;

          if (this.finger < 0.5) {
            this.animateSwipe(0);
          } else {
            this.animateSwipe(1, undefined, function () {
              _this4.finger = 0;
              _this4.incrementSprite();
            });
          }
        }
      },
      {
        key: 'animateSwipe',
        value: function animateSwipe(to) {
          var _this5 = this;

          var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
          var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Function();

          var from = this.finger;
          var startTime = Date.now();
          var timer = setInterval(function () {
            var time = Date.now() - startTime;
            var value = time / duration;
            if (time > duration) {
              _this5.finger = to;
              _this5.fingerActive = 0;
              clearInterval(timer);
              cb();
            } else {
              _this5.finger = from + (to - from) * value;
              _this5.fingerActive = 1 - value;
            }
          }, INTERVAL);
        }
      },
      {
        key: 'clearPaint',
        value: function clearPaint() {
          this.paintArray.length = 0;
          this.paintAge = 0;
          if (this.scaleUpTimer) {
            clearInterval(this.scaleUpTimer);
            this.scaleUpTimer = null;
          }
        }
      },
      {
        key: 'scaleUpPaint',
        value: function scaleUpPaint() {
          var _this6 = this;

          var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
          var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Function();

          var TO = 1;
          var from = this.paintAge;
          var startTime = Date.now();
          this.scaleUpTimer = setInterval(function () {
            var time = Date.now() - startTime;
            var value = time / duration;
            if (time > duration) {
              _this6.paintAge = TO;
              _this6.clearPaint();
              cb();
            } else {
              _this6.paintAge = from + (TO - from) * value;
            }
          }, INTERVAL);
        }
      },
      {
        key: 'draw',
        value: function draw(ctx) {
          var configA = this.spriteConfig[this.spriteIndex];
          var configB = this.spriteConfig[(this.spriteIndex + 1) % this.spriteConfig.length];

          this.drawSprite(ctx, configA);

          switch (this.mode) {
            case _ENUM.MODE.SWIPE:
              this.drawSprite(ctx, configB, this.finger);
              break;
            case _ENUM.MODE.PAINT:
              this.drawSpriteOnPaint(ctx, configB);
              break;

            case _ENUM.MODE.GRAPH:
              this.drawSpriteOnGraph(ctx, configB)
              break
          }
        }
      },
      {
        key: 'drawSprite',
        value: function drawSprite(ctx, config) {
          var length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

          length = Math.min(length, 1);

          var srcWidth = Math.floor((config.x2 - config.x1) * length);
          var destWidth = Math.floor(this.width * length);

          if (!srcWidth || !destWidth) {
            return;
          }

          ctx.drawImage(this.video,

            // source image
            config.x1, config.y1, srcWidth, config.y2 - config.y1,

            // dest image
            0, 0, destWidth, this.height);
        }
      },
      {
        key: 'drawSpriteOnPaint',
        value: function drawSpriteOnPaint(ctx, config) {
          var _this7 = this;

          this.paintCanvas.width = this.width;
          this.paintCanvas.height = this.height;

          if (!this.paintArray.length) {
            return;
          }

          var lastDot = _.last(this.paintArray);
          var scale = 1 + this.paintAge * (PAINT_MAX_SCALE - 1);

          this.paintCtx.save();
          this.paintCtx.translate(lastDot[0], lastDot[1]);
          if (scale > 1) {
            this.paintCtx.scale(scale, scale);
          }
          this.paintCtx.beginPath();
          _.each(this.paintArray, function (dot, index) {
            _this7.paintCtx.moveTo(dot[0] - lastDot[0], dot[1] - lastDot[1]);
            _this7.paintCtx.arc(dot[0] - lastDot[0], dot[1] - lastDot[1], PAINT_WIDTH / 2, 0, Math.PI * 2);
          });
          this.paintCtx.restore();
          this.paintCtx.clip();

          this.drawSprite(this.paintCtx, config);

          ctx.drawImage(this.paintCanvas, 0, 0);
        }
      },
      {
        key: 'drawSpriteOnGraph',
        value: function drawSpriteOnGraph(ctx, config) {
          var _this7 = this;

          this.paintCanvas.width = this.width;
          this.paintCanvas.height = this.height;

          if (!this.paintArray.length) {
            return;
          }

          var lastDot = _.last(this.paintArray);
          var scale = 1 + this.paintAge * (PAINT_MAX_SCALE - 1);

          this.paintCtx.save();
          this.paintCtx.translate(lastDot[0], lastDot[1]);
          if (scale > 1) {
            this.paintCtx.scale(scale, scale);
          }
          this.paintCtx.beginPath();
          _.each(this.paintArray, function (dot, index) {
            _this7.paintCtx.moveTo(dot[0] - lastDot[0], dot[1] - lastDot[1]);
            _this7.paintCtx.strokeStyle = "#fff"
            _this7.paintCtx.rect(dot[0] - lastDot[0], dot[1] - lastDot[1], PAINT_WIDTH, PAINT_WIDTH)
            // _this7.paintCtx.strokeRect(dot[0] - lastDot[0], dot[1] - lastDot[1], PAINT_WIDTH, PAINT_WIDTH)

          });
          this.paintCtx.restore();
          this.paintCtx.clip();

          this.drawSprite(this.paintCtx, config);

          ctx.drawImage(this.paintCanvas, 0, 0);
        }
      },
      {
        key: 'startVideo',
        value: function startVideo() {
          if (!this.video.paused) {
            return;
          }
          this.video.play();
          this.startTime = Date.now();
          this.emit('start');
        }
      },
      {
        key: 'restartVideo',
        value: function restartVideo() {
          if (!this.video.paused) {
            return;
          }
          this.video.currentTime = 0;
          this.startVideo();
        }
      },
      {
        key: 'pauseVideo',
        value: function pauseVideo() {
          if (this.video.paused) {
            return;
          }
          this.video.pause();
          this.startTime = null;
          this.emit('pause');
        }
      },
      {
        key: 'togglePlay',
        value: function togglePlay() {
          this.video.paused ? this.startVideo() : this.pauseVideo();
        }
      }
    ]
  );

  return SwipeVideo;
}(_events);
