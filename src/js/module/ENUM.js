import _lodash from 'lodash'

exports.PHASE = exports.MODE = exports.SWIPE_TYPE = undefined;

exports.SWIPE_TYPE = {
  NEXT: 'next',
  PREV: 'prev'
};

exports.MODE = {
  SWIPE: 'swipe',
  PAINT: 'paint'
};

exports.PHASE = _lodash.invert(['LANDING', 'LOADING', 'LOADED', 'PLAYING', 'ENDED']);