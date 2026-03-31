const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded =
    normalized.length % 4 === 0
      ? normalized
      : normalized.padEnd(normalized.length + (4 - (normalized.length % 4)), "=");

  return window.atob(padded);
};

const parseTokenPayload = (token) => {
  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }

    return JSON.parse(decodeBase64Url(payload));
  } catch (error) {
    return null;
  }
};

export const clearStoredToken = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("token");
};

export const isTokenExpired = (token) => {
  const payload = parseTokenPayload(token);

  if (!payload) {
    return true;
  }

  if (typeof payload.exp !== "number") {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
};

export const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const token = window.localStorage.getItem("token");
  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    clearStoredToken();
    return null;
  }

  return token;
};

export const hasActiveSession = () => Boolean(getStoredToken());

export const buildAuthHeaders = (headersInit = {}) => {
  const headers = new Headers(headersInit);

  if (!headers.has("Content-Type")) {
    headers.append("Content-Type", "application/json");
  }

  const token = getStoredToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};

export const isUnauthorizedStatus = (status) => status === 401 || status === 403;
