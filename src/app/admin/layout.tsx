import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

// Admin shell. Middleware already gates /admin/* to ADMIN|CONCIERGE; this is a
// second server-side check so the page never renders for anyone else.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user) redirect("/portal");
  if (role !== "ADMIN" && role !== "CONCIERGE") redirect("/portal");

  return (
    <div style={{ minHeight: "100vh", background: "#f7ecda" }}>
      <header style={{ background: "#101f31", color: "#ecdcc0" }}>
        <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-7" style={{ height: 68 }}>
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/assets/logo.png" alt="AuMatch" width={32} height={32} style={{ height: 32, width: "auto" }} />
            <span className="au-serif" style={{ fontSize: 20, fontWeight: 600 }}>
              <span style={{ color: "#d8b878" }}>Au</span>
              <span style={{ color: "#fff8ec" }}>Match</span>
              <span style={{ fontSize: 12, letterSpacing: ".2em", color: "rgba(236,220,192,.5)", marginLeft: 10 }}>ADMIN</span>
            </span>
          </Link>
          <div className="flex items-center gap-5" style={{ fontSize: 13 }}>
            <Link href="/" style={{ color: "rgba(236,220,192,.7)" }}>View site ↗</Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" style={{ background: "transparent", color: "#ecdcc0", border: "1px solid rgba(209,176,105,.4)", padding: "8px 16px", fontSize: 13, cursor: "pointer", borderRadius: 2 }}>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-content px-7 py-8">{children}</main>
    </div>
  );
}
