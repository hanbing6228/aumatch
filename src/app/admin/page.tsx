"use client";

import { useEffect, useState, useCallback } from "react";

type Lead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  // employer
  location?: string;
  services?: string[];
  frequency?: string | null;
  budget?: string | null;
  notes?: string | null;
  // provider
  city?: string;
  availability?: string | null;
  expectedRate?: string | null;
  documentName?: string | null;
  consentBgCheck?: boolean;
};

type Booking = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  topic?: string | null;
  startTime?: string | null;
  status: string;
  createdAt: string;
};

const STATUSES = ["NEW", "CONTACTED", "IN_PROGRESS", "PLACED", "CLOSED", "ARCHIVED"];
const TABS = [
  { key: "employer", label: "Family Leads" },
  { key: "provider", label: "Provider Applications" },
  { key: "bookings", label: "Consultations" },
] as const;

export default function AdminPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("employer");
  const [data, setData] = useState<{ employerLeads: Lead[]; providerApplications: Lead[]; bookings: Booking[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      if (!res.ok) throw new Error("Failed to load");
      setData(await res.json());
    } catch {
      setError("Could not load leads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (type: "employer" | "provider", id: string, status: string) => {
    await fetch(`/api/admin/leads/${type}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const counts = {
    employer: data?.employerLeads.length ?? 0,
    provider: data?.providerApplications.length ?? 0,
    bookings: data?.bookings.length ?? 0,
  };

  return (
    <div>
      <h1 className="au-serif" style={{ fontSize: 34, fontWeight: 600, color: "#1c3a5e", margin: "0 0 6px" }}>Lead Management</h1>
      <p style={{ color: "#6f6450", margin: "0 0 24px", fontSize: 14 }}>
        Family intake, provider applications and consultation bookings — newest first.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "10px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", borderRadius: 2,
              border: `1px solid ${tab === t.key ? "#b1812f" : "rgba(54,41,26,.18)"}`,
              background: tab === t.key ? "#1c3a5e" : "#fffaf2",
              color: tab === t.key ? "#fff8ec" : "#36291a",
            }}
          >
            {t.label} <span style={{ opacity: 0.6 }}>· {counts[t.key]}</span>
          </button>
        ))}
        <button onClick={load} style={{ marginLeft: "auto", padding: "10px 18px", fontSize: 13, cursor: "pointer", borderRadius: 2, border: "1px solid rgba(54,41,26,.18)", background: "#fffaf2", color: "#6f6450" }}>
          ↻ Refresh
        </button>
      </div>

      {error && <div className="au-err">{error}</div>}
      {loading && <div style={{ color: "#6f6450" }}>Loading…</div>}

      {!loading && data && (
        <div style={{ overflowX: "auto", border: "1px solid rgba(54,41,26,.12)", background: "#fffaf2" }}>
          {tab === "employer" && (
            <LeadTable
              rows={data.employerLeads}
              cols={["Name", "Contact", "Location", "Services", "Freq / Budget", "Notes", "Status"]}
              render={(l) => [
                <strong key="n">{l.fullName}</strong>,
                <Contact key="c" email={l.email} phone={l.phone} />,
                l.location,
                (l.services || []).join(", "),
                `${l.frequency || "—"} / ${l.budget || "—"}`,
                <span key="no" style={{ display: "block", maxWidth: 220, color: "#6f6450" }}>{l.notes || "—"}</span>,
                <StatusSelect key="s" value={l.status} onChange={(v) => updateStatus("employer", l.id, v)} />,
              ]}
            />
          )}
          {tab === "provider" && (
            <LeadTable
              rows={data.providerApplications}
              cols={["Name", "Contact", "City", "Availability", "Rate", "Document", "BG", "Status"]}
              render={(l) => [
                <strong key="n">{l.fullName}</strong>,
                <Contact key="c" email={l.email} phone={l.phone} />,
                l.city,
                l.availability || "—",
                l.expectedRate || "—",
                l.documentName || "—",
                l.consentBgCheck ? "✓" : "—",
                <StatusSelect key="s" value={l.status} onChange={(v) => updateStatus("provider", l.id, v)} />,
              ]}
            />
          )}
          {tab === "bookings" && (
            <LeadTable
              rows={data.bookings}
              cols={["Name", "Contact", "Topic", "Requested time", "Status", "Booked"]}
              render={(b) => [
                <strong key="n">{b.fullName}</strong>,
                <Contact key="c" email={b.email} phone={b.phone || ""} />,
                b.topic || "—",
                b.startTime ? new Date(b.startTime).toLocaleString() : "—",
                b.status,
                new Date(b.createdAt).toLocaleDateString(),
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
}

function LeadTable<T extends { id: string }>({
  rows, cols, render,
}: {
  rows: T[];
  cols: string[];
  render: (row: T) => React.ReactNode[];
}) {
  if (rows.length === 0) {
    return <div style={{ padding: 40, textAlign: "center", color: "#9a8e76" }}>No records yet.</div>;
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
      <thead>
        <tr style={{ background: "#1c3a5e", color: "#ecdcc0" }}>
          {cols.map((c) => (
            <th key={c} style={{ textAlign: "left", padding: "12px 14px", fontWeight: 600, letterSpacing: ".03em", whiteSpace: "nowrap" }}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} style={{ borderTop: "1px solid rgba(54,41,26,.1)" }}>
            {render(row).map((cell, i) => (
              <td key={i} style={{ padding: "12px 14px", verticalAlign: "top", color: "#36291a" }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Contact({ email, phone }: { email: string; phone: string }) {
  return (
    <div style={{ lineHeight: 1.5 }}>
      <a href={`mailto:${email}`} style={{ color: "#b1812f" }}>{email}</a>
      {phone && <div style={{ color: "#6f6450" }}>{phone}</div>}
    </div>
  );
}

function StatusSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: "7px 10px", fontSize: 12.5, borderRadius: 2, border: "1px solid rgba(54,41,26,.2)", background: "#fdf7ec", cursor: "pointer" }}>
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
