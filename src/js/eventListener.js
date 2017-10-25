import {swipeVideo} from './swipeVideo'

export const menuToggleBind = () => {
  const menuToggle = document.querySelector('.js-menu-toggle')

  menuToggle.addEventListener('click', function () {
    const isOpend = document.body.getAttribute('data-menu-opend') == 'true'
    document.body.setAttribute('data-menu-opend', isOpend ? 'false' : 'true')
    document.body.scrollTop = 0

    if (isOpend) {
      swipeVideo.startVideo()
    } else {
      swipeVideo.pauseVideo()
    }
  })
}

export const replayBtnBind = () => {
  const replayBtn = document.querySelector('.js-replay')
  const ending = document.querySelector('.js-ending')

  replayBtn.addEventListener('click', function () {
    swipeVideo.restartVideo()
    ending.setAttribute('data-shown', false)
  })
}