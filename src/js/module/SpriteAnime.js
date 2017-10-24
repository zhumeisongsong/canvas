import _events from 'events'

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

const SpriteAnime = function (_EventEmitter) {
  _inherits(SpriteAnime, _EventEmitter);

  function SpriteAnime() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SpriteAnime);

    var _this = _possibleConstructorReturn(this, (SpriteAnime.__proto__ || Object.getPrototypeOf(SpriteAnime)).call(this));

    _this.src = opts.src;
    _this.width = isNaN(opts.width) ? 0 : opts.width;
    _this.height = isNaN(opts.height) ? 0 : opts.height;
    _this.length = isNaN(opts.length) ? 1 : opts.length;
    _this.columns = isNaN(opts.columns) ? 1 : opts.columns;
    _this.duration = isNaN(opts.duration) ? 1000 : opts.duration;
    _this.loop = !!opts.loop;

    _this.rows = Math.ceil(_this.length / _this.columns);
    _this.cellWidth = _this.width / _this.columns;
    _this.cellHeight = _this.height / _this.rows;
    return _this;
  }

  _createClass(SpriteAnime, [{
    key: 'start',
    value: function start() {
      this.startTime = Date.now();
    }
  }, {
    key: 'draw',
    value: function draw(ctx) {
      var time = Date.now() - this.startTime;

      if (!this.loop && time > this.duration) {
        this.drawFrame(ctx, this.length - 1);
        return;
      }

      var frame = Math.floor(this.length * time / this.duration) % this.length;
      this.drawFrame(ctx, frame);
    }
  }, {
    key: 'drawFrame',
    value: function drawFrame(ctx, frame) {
      this.initImage();

      var x = frame % this.columns;
      var y = Math.floor(frame / this.columns);

      ctx.drawImage(this.img,
        // source image
        this.cellWidth * x, this.cellHeight * y, this.cellWidth, this.cellHeight,
        // dest image
        Math.floor(-this.cellWidth / 2), Math.floor(-this.cellHeight / 2), this.cellWidth, this.cellHeight);
    }
  }, {
    key: 'initImage',
    value: function initImage() {
      if (this.img) {
        return;
      }
      var img = new Image();
      img.src = this.src;
      this.img = img;
    }
  }]);

  return SpriteAnime;
}(_events);

export default SpriteAnime;