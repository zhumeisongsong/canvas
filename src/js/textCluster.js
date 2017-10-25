import _TextCluster from'./module/TextCluster'
import _VIDEO_CONFIG from './module/VIDEO_CONFIG'

const MAX_TEXT_CLUSTER = 3

export const addTextCluster = (x, y) => {
  let textClusterArray = []
  const textCluster = new _TextCluster({
    width: _VIDEO_CONFIG.WIDTH,
    height: _VIDEO_CONFIG.HEIGHT
  })
  textCluster.start([x, y])

  while (textClusterArray.length >= MAX_TEXT_CLUSTER) {
    textClusterArray.shift()
  }
  textClusterArray.push(textCluster)
  
  return textClusterArray
}
