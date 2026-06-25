import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const MAX = 5 * 1024 * 1024; // 5 MB
const ALLOWED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

// Uploads a provider's resume / certificate to Vercel Blob and returns its URL.
// Requires BLOB_READ_WRITE_TOKEN (set automatically when a Vercel Blob store is
// connected). Without it, returns 503 so the client falls back to name-only.
export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Uploads not configured", configured: false },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > MAX) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
  }

  const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120);
  const blob = await put(`providers/${Date.now()}-${safeName}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url, name: file.name });
}
