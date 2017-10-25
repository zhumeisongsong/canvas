import _ from 'lodash'

exports.PHASE = exports.MODE = exports.SWIPE_TYPE = undefined;

exports.SWIPE_TYPE = {
  NEXT: 'next',
  PREV: 'prev'
};

exports.MODE = {
  SWIPE: 'swipe',
  PAINT: 'paint',
  GRAPH:'graph'
};

exports.PHASE = _.invert(['LANDING', 'LOADING', 'LOADED', 'PLAYING', 'ENDED']);