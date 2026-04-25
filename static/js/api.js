const cfg = window.__CONFIG ?? {};

export async function apiGet(path) {
  if (!cfg.apiBaseURL) {
    throw new Error("apiBaseURL not configured (set params.api.baseURL in hugo.toml)");
  }
  const auth = window.__auth;
  if (!auth) throw new Error("not authenticated");
  const token = await auth.getFreshToken();
  const url = new URL(path.replace(/^\//, ""), cfg.apiBaseURL.replace(/\/?$/, "/"));
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
