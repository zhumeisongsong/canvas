import _VIDEO_CHAPTER from'./module/VIDEO_CHAPTER'
import _ENUM from'./module/ENUM'

import {swipeVideo} from './swipeVideo'

export function chooseMode(videoDom) {
  let seconds = videoDom.currentTime

  // if (seconds < _VIDEO_CHAPTER.BMELO) {
  //   // INTRO, AMELO
  //   swipeVideo.setMode(_ENUM.MODE.SWIPE)
  // } else if (seconds < _VIDEO_CHAPTER.SABI1) {
  //   // BMELO
  //   swipeVideo.setMode(_ENUM.MODE.PAINT)
  // } else if (seconds < _VIDEO_CHAPTER.SABI2) {
  //   // SABI1
  //   swipeVideo.setMode(_ENUM.MODE.SWIPE)
  // } else if (seconds < _VIDEO_CHAPTER.OUTRO) {
  //   // SABI2
  //   swipeVideo.setMode(_ENUM.MODE.PAINT)
  // } else {
  //   // OUTRO
  //   swipeVideo.setMode(_ENUM.MODE.SWIPE)
  // }

  if (seconds < _VIDEO_CHAPTER.OUTRO) {
    swipeVideo.setMode(_ENUM.MODE.GRAPH)
  }
}
