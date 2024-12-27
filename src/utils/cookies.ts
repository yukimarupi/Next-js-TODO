import Cookies from 'js-cookie';

export const setCookie = (key: string, value: string) => {
  Cookies.set(key, value, { expires: 7 });
};

export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key);
};

export const deleteCookie = (key: string) => {
  Cookies.remove(key);
};
