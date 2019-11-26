import Cookie from 'js-cookie';
import * as Constants from './Constants';

export const getCorrectSessionId = hostname => {
  let sessionId;
  if (hostname.indexOf('stg1') > -1) {
    sessionId = Cookie.get(Constants.stg1CookieName);
  } else if (hostname.indexOf('dev1') > -1) {
    sessionId = Cookie.get(Constants.dev1CookieName);
  } else if (hostname === 'clover.com' || hostname === 'www.clover.com') {
    sessionId = Cookie.get(Constants.usCookieName);
  } else if (hostname.indexOf('eu.clover') > -1) {
    sessionId = Cookie.get(Constants.euCookieName);
  } else if (hostname.indexOf('dev-cos') > -1) {
    // TODO this ain't working for stg1
    sessionId = Cookie.get(Constants.dev1CookieName);
  } else if (hostname.indexOf('usprod-cos') > -1) {
    sessionId = Cookie.get(Constants.usCookieName);
  }
  return sessionId;
};

export const logout = () => {
  Cookie.remove(Constants.dev1CookieName);
  Cookie.remove(Constants.stg1CookieName);
  Cookie.remove(Constants.usCookieName);
  Cookie.remove(Constants.euCookieName);
};
