export function deleteCookies(cookieName: string, cookieValue?: string) {
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (cookieName && cookieValue) {
      if (name?.includes(cookieName) && value?.includes(cookieValue)) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      }
    }
    if (cookieName && !cookieValue) {
      if (name?.includes(cookieName)) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      }
    }
  }
}

export function setCookiesWithPrefix(prefix: string) {
  // get matching items from localStorage first
  const matchingItems = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      const value = localStorage.getItem(key);
      matchingItems.push({ key, value });
    }
  }
  // set matching items as cookies
  matchingItems.forEach((item) => {
    document.cookie = `${item.key}=${item.value}; path=/`;
  });
}

export function setLocalStorageFromCookies(cookieName: string) {
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name?.includes(cookieName)) {
      localStorage.setItem(name ?? "", value ?? "");
    }
  }
}
