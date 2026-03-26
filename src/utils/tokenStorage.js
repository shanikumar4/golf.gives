const TOKEN_KEY = "gcp_token";
const USER_KEY  = "gcp_user";

export const tokenStorage = {
  get:        ()      => localStorage.getItem(TOKEN_KEY),
  set:        (t)     => localStorage.setItem(TOKEN_KEY, t),
  remove:     ()      => localStorage.removeItem(TOKEN_KEY),
  getUser:    ()      => { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } },
  setUser:    (u)     => localStorage.setItem(USER_KEY, JSON.stringify(u)),
  removeUser: ()      => localStorage.removeItem(USER_KEY),
  clear:      ()      => { tokenStorage.remove(); tokenStorage.removeUser(); },
};