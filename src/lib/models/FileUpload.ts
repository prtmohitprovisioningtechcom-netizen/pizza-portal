import { query, execute } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export interface FileUploadDoc {
  _id: string;
  id: number;
  filename: string;
  mimetype: string;
  data: Buffer;
  size: number;
  uploadedAt: Date;
}

export const FileUpload = {
  async create(data: {
    filename: string;
    mimetype: string;
    data: Buffer;
    size: number;
  }): Promise<{ _id: string; id: number }> {
    const result = await execute<ResultSetHeader>(
      "INSERT INTO file_uploads (filename, mimetype, data, size) VALUES (?, ?, ?, ?)",
      [data.filename, data.mimetype, data.data, data.size]
    );
    return {
      _id: String(result.insertId),
      id: result.insertId,
    };
  },

  async findById(id: unknown): Promise<FileUploadDoc | null> {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return null;

    const rows = await query<RowDataPacket[]>(
      "SELECT id, filename, mimetype, data, size, uploadedAt FROM file_uploads WHERE id = ? LIMIT 1",
      [numId]
    );
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      _id: String(r.id),
      id: r.id,
      filename: r.filename ?? "file",
      mimetype: r.mimetype ?? "application/octet-stream",
      data: Buffer.isBuffer(r.data) ? r.data : Buffer.from(r.data),
      size: Number(r.size ?? 0),
      uploadedAt: r.uploadedAt ? new Date(r.uploadedAt) : new Date(),
    };
  },
};
