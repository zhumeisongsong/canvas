var _createClass = function () {
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

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _SpriteAnime = require('./SpriteAnime');

var _SpriteAnime2 = _interopRequireDefault(_SpriteAnime);

var _SPRITE_ANIME_CONFIG = require('./SPRITE_ANIME_CONFIG');

var _SPRITE_ANIME_CONFIG2 = _interopRequireDefault(_SPRITE_ANIME_CONFIG);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

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

var MIN_DISTANCE = 0;
var MAX_DISTANCE = 1000;
var MIN_SCALE = 0.5;
var MAX_SCALE = 1;

var TextCluster = function (_EventEmitter) {
  _inherits(TextCluster, _EventEmitter);

  function TextCluster() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, TextCluster);

    var _this = _possibleConstructorReturn(this, (TextCluster.__proto__ || Object.getPrototypeOf(TextCluster)).call(this));

    _this.width = isNaN(opts.width) ? 0 : opts.width;
    _this.height = isNaN(opts.height) ? 0 : opts.height;
    _this.duration = isNaN(opts.duration) ? 1000 : opts.duration;

    _this.startTime = null;

    _this.initTextArray();
    return _this;
  }

  _createClass(TextCluster, [{
    key: 'initTextArray',
    value: function initTextArray() {
      var configPattern = [_SPRITE_ANIME_CONFIG2.default.TEXT1, _SPRITE_ANIME_CONFIG2.default.TEXT2, _SPRITE_ANIME_CONFIG2.default.TEXT3, _SPRITE_ANIME_CONFIG2.default.TEXT4];

      this.textArray = _lodash2.default.map(new Array(10), function () {
        var config = configPattern[Math.floor(Math.random() * configPattern.length)];
        return {
          anime: new _SpriteAnime2.default(config)
        };
      });
    }
  }, {
    key: 'start',
    value: function start(pos) {
      this.startTime = Date.now();
      _lodash2.default.each(this.textArray, function (text) {
        text.x = pos[0];
        text.y = pos[1];
        text.rad = Math.PI * 2 * Math.random();
        text.distance = MIN_DISTANCE + (MAX_DISTANCE - MIN_DISTANCE) * Math.random();
        text.scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * Math.random();
        text.anime.start();
      });
    }
  }, {
    key: 'draw',
    value: function draw(ctx) {
      if (!this.startTime) {
        return;
      }

      var time = Date.now() - this.startTime;
      if (this.duration < time) {
        this.startTime = null;
        return;
      }

      var value = time / this.duration;

      _lodash2.default.each(this.textArray, function (text, index) {
        var x = text.x + Math.cos(text.rad) * text.distance * value;
        var y = text.y + Math.sin(text.rad) * text.distance * value;
        ctx.save();
        ctx.globalAlpha = 1 - value;
        ctx.translate(Math.floor(x), Math.floor(y));
        ctx.scale(text.scale, text.scale);
        text.anime.draw(ctx);
        ctx.restore();
      });
    }
  }]);

  return TextCluster;
}(_events2.default);

exports.default = TextCluster;