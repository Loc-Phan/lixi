// Hook
export function useLocalStorage() {

  const checkEnableCookie = () => {
    let cookieEnabled = navigator.cookieEnabled;
    if (!cookieEnabled) {
      document.cookie = 'facebookadscookiehere';
      cookieEnabled = document.cookie.indexOf('facebookadscookiehere') !== -1;
    }
    return cookieEnabled;
  }

  const setItem = (key, values) => {
    if(checkEnableCookie() && typeof window !== "undefined") {
      return window.localStorage.setItem(key, values);
    }
  }

  const getItem = (key) => {
    if(checkEnableCookie() && typeof window !== "undefined") {
      return window.localStorage.getItem(key);
    } else {
      return null;
    }
  }

  const removeItem = (key) => {
    if(checkEnableCookie() && typeof window !== "undefined") {
      return window.localStorage.removeItem(key);
    }
  }

  return {
    checkEnableCookie,
    setItem,
    getItem,
    removeItem,
  };
}
