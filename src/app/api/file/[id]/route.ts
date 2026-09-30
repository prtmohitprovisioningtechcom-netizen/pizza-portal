import { NextResponse } from "next/server";
import { connectDB, isValidId } from "@/lib/db";
import { FileUpload } from "@/lib/models/FileUpload";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    if (!isValidId(id)) {
      return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
    }

    const fileDoc = await FileUpload.findById(id);

    if (!fileDoc) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", fileDoc.mimetype || "application/octet-stream");
    headers.set("Content-Length", String(fileDoc.data.length));
    headers.set(
      "Content-Disposition",
      `inline; filename="${fileDoc.filename || "file"}"`
    );
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(new Uint8Array(fileDoc.data), { headers });
  } catch (e) {
    console.error("File fetch error:", e);
    return NextResponse.json({ error: "Failed to retrieve file" }, { status: 500 });
  }
}
