export const menuToggleListener = (swipeVideo) => {
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

export const replayBtnListener = (swipeVideo) => {
  const replayBtn = document.querySelector('.js-replay')

  replayBtn.addEventListener('click', function () {
    swipeVideo.restartVideo()
    ending.setAttribute('data-shown', false)
  })
}