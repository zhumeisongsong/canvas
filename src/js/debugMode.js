const locationSearch = (location.search || '').replace(/^\?/, '')
const locationParams = _querystring.parse(locationSearch)
locationParams.debug = true

//debug
const checkDebugMode = () => {
  if (locationParams.debug) {
    document.querySelector('.js-debug-ui').style.display = "block";
  }
}