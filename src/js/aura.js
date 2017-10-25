import _ENUM from'./module/ENUM'
import _VIDEO_CONFIG from './module/VIDEO_CONFIG'
import _SPRITE_ANIME_CONFIG from'./module/SPRITE_ANIME_CONFIG'

import _SpriteAnime from './module/SpriteAnime'

import {swipeVideo} from './swipeVideo'

const auraAnime = new _SpriteAnime(_SPRITE_ANIME_CONFIG.AURA)
auraAnime.initImage()
auraAnime.start()

export const drawAura = (pos,ctx) => {
  let scale = _VIDEO_CONFIG.HEIGHT / auraAnime.cellHeight
  let xOffset = 0.45

  ctx.save()
  ctx.globalAlpha = swipeVideo.fingerActive
  if (swipeVideo.swipeType == _ENUM.SWIPE_TYPE.PREV) {
    ctx.translate(_VIDEO_CONFIG.WIDTH * pos + auraAnime.cellWidth * xOffset, _VIDEO_CONFIG.HEIGHT * 0.5)
    ctx.scale(scale, scale)
  } else {
    ctx.translate(_VIDEO_CONFIG.WIDTH * pos - auraAnime.cellWidth * xOffset, _VIDEO_CONFIG.HEIGHT * 0.5)
    ctx.scale(-scale, scale)
  }
  auraAnime.draw(ctx)
  ctx.restore()
}