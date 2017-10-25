import _querystring from 'querystring'

const locationSearch = (location.search || '').replace(/^\?/, '')
export const locationParams = _querystring.parse(locationSearch)

