import { NextRequest } from "next/server";
import { connectToDb } from "@/utils/database";
import Setting from "@/db/models/setting.model";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDb();
    // Real round-trip to MongoDB, not just a connection check: counts the
    // (single-document) settings collection to prove the DB actually answered.
    const settingsCount = await Setting.countDocuments();

    return Response.json({
      ok: true,
      ts: new Date().toISOString(),
      reachable: true,
      settingsCount,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        ts: new Date().toISOString(),
        reachable: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
