import _UA from './UA'

const ENVS = {
  pc: {
    src: './video/questy_v6-l.mp4',
    width: 1920 / 2,
    height: 1080 / 2
  },
  ios: {
    src: './video/questy_v6-m.mov',
    width: 1440 / 2,
    height: 810 / 2
  }
}

export default {
  SRC: _UA.isIOS ? ENVS.ios.src : ENVS.pc.src,
  WIDTH: _UA.isIOS ? ENVS.ios.width : ENVS.pc.width,
  HEIGHT: _UA.isIOS ? ENVS.ios.height : ENVS.pc.height
}