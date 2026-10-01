import { NextResponse } from "next/server";
import { Restaurant } from "@/lib/models/Restaurant";
import { verifySuperAdminSession } from "@/lib/superadmin-session";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const session = await verifySuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Super Admin access required" }, { status: 401 });
    }

    const list = await Restaurant.findAll();

    const summary = {
      total: list.length,
      active: list.filter((r) => r.status === "active").length,
      pending: list.filter((r) => r.status === "pending").length,
      suspended: list.filter((r) => r.status === "suspended" || r.status === "inactive").length,
      paidCount: list.filter((r) => r.paymentStatus === "paid").length,
      pendingPaymentCount: list.filter((r) => r.paymentStatus === "pending").length,
      totalRevenue: list.reduce((acc, curr) => acc + (Number(curr.paymentAmount) || 0), 0),
    };

    return NextResponse.json({
      ok: true,
      summary,
      restaurants: list,
    });
  } catch (e) {
    console.error("Super Admin restaurants fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await verifySuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Super Admin access required" }, { status: 401 });
    }

    const body = await request.json();
    const id = Number(body.id);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Invalid restaurant ID" }, { status: 400 });
    }

    const updates: {
      name?: string;
      ownerName?: string;
      phone?: string;
      email?: string;
      status?: "active" | "pending" | "inactive" | "suspended";
      paymentStatus?: "paid" | "pending" | "failed";
      paymentAmount?: number;
      paymentNotes?: string;
      assignedTo?: number | null;
      assignedName?: string | null;
      assignedRole?: string | null;
      taskNotes?: string;
      taskStatus?: "pending" | "in_progress" | "completed";
      monthlyFee?: number;
      billingDueDate?: string | null;
      subscriptionStatus?: "active" | "expired" | "suspended";
      lastPaymentDate?: string | null;
    } = {};

    if (body.name !== undefined) updates.name = String(body.name);
    if (body.ownerName !== undefined) updates.ownerName = String(body.ownerName);
    if (body.phone !== undefined) updates.phone = String(body.phone);
    if (body.email !== undefined) updates.email = String(body.email);
    if (body.status !== undefined) updates.status = body.status;
    if (body.paymentStatus !== undefined) updates.paymentStatus = body.paymentStatus;
    if (body.paymentAmount !== undefined) updates.paymentAmount = Number(body.paymentAmount);
    if (body.paymentNotes !== undefined) updates.paymentNotes = String(body.paymentNotes);
    if (body.assignedTo !== undefined) updates.assignedTo = body.assignedTo === null ? null : Number(body.assignedTo);
    if (body.assignedName !== undefined) updates.assignedName = body.assignedName;
    if (body.assignedRole !== undefined) updates.assignedRole = body.assignedRole;
    if (body.taskNotes !== undefined) updates.taskNotes = String(body.taskNotes);
    if (body.taskStatus !== undefined) updates.taskStatus = body.taskStatus;
    if (body.monthlyFee !== undefined) updates.monthlyFee = Number(body.monthlyFee);
    if (body.billingDueDate !== undefined) updates.billingDueDate = body.billingDueDate ? String(body.billingDueDate).slice(0, 10) : null;
    if (body.subscriptionStatus !== undefined) updates.subscriptionStatus = body.subscriptionStatus;
    if (body.lastPaymentDate !== undefined) updates.lastPaymentDate = body.lastPaymentDate ? String(body.lastPaymentDate).slice(0, 10) : null;

    const success = await Restaurant.updateStatus(id, updates);
    if (!success) {
      return NextResponse.json({ error: "Failed to update restaurant" }, { status: 400 });
    }

    const updated = await Restaurant.findById(id);
    return NextResponse.json({ ok: true, restaurant: updated });
  } catch (e) {
    console.error("Super Admin restaurant update error:", e);
    return NextResponse.json({ error: "Failed to update restaurant" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await verifySuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Super Admin access required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Invalid restaurant ID" }, { status: 400 });
    }

    // Protect primary platform restaurant (id 1)
    if (id === 1) {
      return NextResponse.json({ error: "Cannot delete the primary system restaurant (ID 1)" }, { status: 403 });
    }

    await Restaurant.delete(id);
    // Also cleanup admins associated with this restaurant
    await query("DELETE FROM admins WHERE restaurantId = ?", [id]);

    return NextResponse.json({ ok: true, message: "Restaurant partner deleted successfully" });
  } catch (e) {
    console.error("Super Admin delete error:", e);
    return NextResponse.json({ error: "Failed to delete restaurant" }, { status: 500 });
  }
}
