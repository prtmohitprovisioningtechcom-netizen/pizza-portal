import { NextResponse } from "next/server";
import { SuperAdmin } from "@/lib/models/SuperAdmin";
import { verifySuperAdminSession } from "@/lib/superadmin-session";
import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

export async function GET() {
  try {
    const session = await verifySuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Super Admin access required" }, { status: 401 });
    }

    const staffList = await SuperAdmin.findAll();

    // Get count of restaurants assigned to each staff member
    const counts = await query<RowDataPacket[]>(
      "SELECT assignedTo, COUNT(*) as count FROM restaurants WHERE assignedTo IS NOT NULL GROUP BY assignedTo"
    );
    const countMap: Record<number, number> = {};
    for (const c of counts) {
      if (c.assignedTo) {
        countMap[Number(c.assignedTo)] = Number(c.count || 0);
      }
    }

    const data = staffList.map((s) => ({
      id: s.id,
      username: s.username,
      name: s.name,
      email: s.email || "",
      phone: s.phone || "",
      role: s.role || "superadmin",
      assignedStoresCount: countMap[s.id] || 0,
      createdAt: s.createdAt,
    }));

    return NextResponse.json({ ok: true, staff: data });
  } catch (e: any) {
    console.error("Fetch staff error:", e);
    return NextResponse.json({ error: "Failed to fetch staff directory" }, { status: 500 });
  }
}
