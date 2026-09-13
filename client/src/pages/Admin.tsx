import { useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminSession } from "@/hooks/useAdminSession";
import {
  adminLogin,
  adminListIpos,
  adminListSources,
  adminToggleSource,
  adminListLogs,
  adminTriggerJob,
  adminEditGmp,
  adminDeleteIpo,
} from "@/services/adminApi";
import { LogOut, PlayCircle, RefreshCw, ShieldAlert, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

const JOBS = [
  { key: "gmp", label: "Refresh GMP" },
  { key: "statuses", label: "Refresh IPO statuses" },
  { key: "subscriptions", label: "Refresh subscriptions" },
  { key: "ipos", label: "Refresh upcoming IPOs" },
  { key: "articles", label: "Refresh articles" },
  { key: "reviews", label: "Refresh reviews" },
];

export function Admin() {
  const { token, user, isAuthenticated, login, logout } = useAdminSession();

  if (!isAuthenticated) return <AdminLogin onLogin={login} />;
  return <AdminDashboard token={token!} userName={user!.name} onLogout={logout} />;
}

function AdminLogin({ onLogin }: { onLogin: (token: string, user: { id: string; name: string; email: string; role: string }) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token, user } = await adminLogin(email, password);
      onLogin(token, user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-24">
      <Seo title="Admin login" description="Greenshoe admin dashboard login." canonicalPath="/admin" />
      <ShieldAlert className="h-8 w-8 text-brand" />
      <h1 className="mt-3 font-display text-2xl font-semibold">Admin login</h1>
      <p className="mt-1 text-center text-sm text-ink-soft">
        This dashboard talks to the real /api/admin endpoints — it requires the Express + Postgres backend to be
        running (see README).
      </p>
      <form onSubmit={submit} className="mt-6 w-full space-y-3">
        <Input type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-down">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

function AdminDashboard({ token, userName, onLogout }: { token: string; userName: string; onLogout: () => void }) {
  const [ipos, setIpos] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [runningJob, setRunningJob] = useState<string | null>(null);
  const [error, setError] = useState("");

  const refreshAll = () => {
    adminListIpos(token).then(setIpos).catch((e) => setError(e.message));
    adminListSources(token).then(setSources).catch(() => {});
    adminListLogs(token).then(setLogs).catch(() => {});
  };

  useEffect(refreshAll, [token]);

  const runJob = async (job: string) => {
    setRunningJob(job);
    setError("");
    try {
      await adminTriggerJob(token, job);
      refreshAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to run ${job}`);
    } finally {
      setRunningJob(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Seo title="Admin dashboard" description="Greenshoe admin dashboard." canonicalPath="/admin" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Admin dashboard</h1>
          <p className="text-sm text-ink-soft">Signed in as {userName}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </Button>
      </div>

      {error && <p className="mt-4 rounded-md bg-down/10 px-3 py-2 text-sm text-down">{error}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Manual job triggers</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {JOBS.map((job) => (
              <Button key={job.key} variant="outline" onClick={() => runJob(job.key)} disabled={runningJob === job.key}>
                {runningJob === job.key ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <PlayCircle className="h-3.5 w-3.5" />}
                {job.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sources.length === 0 && <p className="text-sm text-ink-soft">No data sources configured yet.</p>}
            {sources.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm">
                <span>{s.name}</span>
                <button
                  onClick={() => adminToggleSource(token, s.id, !s.enabled).then(refreshAll)}
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.enabled ? "bg-brand-soft text-brand" : "bg-ink/10 text-ink-soft"}`}
                >
                  {s.enabled ? "Enabled" : "Disabled"}
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>IPOs ({ipos.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-soft">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">GMP</th>
                <th className="p-3 font-medium">Last updated</th>
                <th className="p-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {ipos.map((ipo) => (
                <tr key={ipo.id} className="border-b border-line last:border-0">
                  <td className="p-3">{ipo.name}</td>
                  <td className="p-3 text-ink-soft">{ipo.status}</td>
                  <td className="p-3">
                    <button
                      className="font-mono-data underline decoration-dotted"
                      onClick={() => {
                        const next = prompt("New GMP value", String(ipo.gmp));
                        if (next != null && !Number.isNaN(Number(next))) {
                          adminEditGmp(token, ipo.id, Number(next)).then(refreshAll);
                        }
                      }}
                    >
                      ₹{ipo.gmp}
                    </button>
                  </td>
                  <td className="p-3 text-ink-soft">{formatRelativeTime(ipo.lastUpdated)}</td>
                  <td className="p-3 text-right">
                    <button
                      className="text-down"
                      onClick={() => {
                        if (confirm(`Delete ${ipo.name}?`)) adminDeleteIpo(token, ipo.id).then(refreshAll);
                      }}
                      aria-label={`Delete ${ipo.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent update logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {logs.slice(0, 15).map((log) => (
            <div key={log.id} className="flex items-center justify-between border-b border-line py-1.5 text-sm last:border-0">
              <span className="font-medium">{log.job}</span>
              <span
                className={
                  log.status === "SUCCESS" ? "text-up" : log.status === "PARTIAL" ? "text-gold" : "text-down"
                }
              >
                {log.status}
              </span>
              <span className="text-ink-soft">{log.recordsTouched} records</span>
              <span className="text-ink-soft">{formatRelativeTime(log.startedAt)}</span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-sm text-ink-soft">No jobs have run yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
