const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Login failed");
  return res.json() as Promise<{ token: string; user: { id: string; name: string; email: string; role: string } }>;
}

export async function adminListIpos(token: string) {
  const res = await fetch(`${API_BASE}/admin/ipos`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to load IPOs");
  return res.json();
}

export async function adminListArticles(token: string) {
  const res = await fetch(`${API_BASE}/admin/articles`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to load articles");
  return res.json();
}

export async function adminListSources(token: string) {
  const res = await fetch(`${API_BASE}/admin/sources`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to load data sources");
  return res.json();
}

export async function adminToggleSource(token: string, id: string, enabled: boolean) {
  const res = await fetch(`${API_BASE}/admin/sources/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ enabled }),
  });
  if (!res.ok) throw new Error("Failed to update data source");
  return res.json();
}

export async function adminListLogs(token: string) {
  const res = await fetch(`${API_BASE}/admin/logs`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to load logs");
  return res.json();
}

export async function adminTriggerJob(token: string, job: string) {
  const res = await fetch(`${API_BASE}/admin/trigger/${job}`, { method: "POST", headers: authHeaders(token) });
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? `Failed to trigger ${job}`);
  return res.json();
}

export async function adminEditGmp(token: string, ipoId: string, gmp: number) {
  const res = await fetch(`${API_BASE}/admin/ipos/${ipoId}/gmp`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ gmp }),
  });
  if (!res.ok) throw new Error("Failed to update GMP");
  return res.json();
}

export async function adminDeleteIpo(token: string, ipoId: string) {
  const res = await fetch(`${API_BASE}/admin/ipos/${ipoId}`, { method: "DELETE", headers: authHeaders(token) });
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete IPO");
}
