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

var HIDE_ATTR = 'data-hidden';
var COMPLETE_ATTR = 'data-complete';

var Loader = function (_EventEmitter) {
  _inherits(Loader, _EventEmitter);

  function Loader() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Loader);

    var _this = _possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).call(this));

    _this.root = opts.root || document.createElement('div');
    _this.value = opts.value || document.createElement('div');

    _this.loadTime = 3000 + 1000 * Math.random();
    return _this;
  }

  _createClass(Loader, [{
    key: 'show',
    value: function show() {
      this.root.setAttribute(HIDE_ATTR, false);
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.root.setAttribute(HIDE_ATTR, true);
    }
  }, {
    key: 'startLoading',
    value: function startLoading() {
      var _this2 = this;

      this.show();

      var listener = function listener() {
        _this2.emit('complete');
        _this2.root.setAttribute(COMPLETE_ATTR, true);
        _this2.value.style.transitionDuration = '';
        _this2.value.removeEventListener('transitionend', listener);
      };

      this.value.style.transitionDuration = '0s';
      this.value.style.width = '0%';

      setTimeout(function () {
        _this2.value.addEventListener('transitionend', listener);
        _this2.value.style.transitionDuration = _this2.loadTime / 1000 + 's';
        _this2.value.style.width = '100%';
      });
    }
  }]);

  return Loader;
}(_events)

export default Loader;