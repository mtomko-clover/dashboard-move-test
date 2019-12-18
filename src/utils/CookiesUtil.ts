import {Cookies} from "./Cookies"

export class CookiesUtil {

  public static getCookie(cookieName: Cookies): string {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  public static setCookie(cookieName: Cookies, value: string): void {
    document.cookie = cookieName + "=" + value;
  }
}
