import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { HttpError, requireRole } from "@/lib/authz";

// Admin/concierge dashboard data: all employer leads, provider applications,
// and consultation bookings in one payload.
export async function GET() {
  try {
    await requireRole("ADMIN", "CONCIERGE");
  } catch (e) {
    if (e instanceof HttpError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }

  const [employerLeads, providerApplications, bookings] = await Promise.all([
    prisma.employerLead.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
    prisma.providerApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
    prisma.consultBooking.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
  ]);

  return NextResponse.json({ employerLeads, providerApplications, bookings });
}
