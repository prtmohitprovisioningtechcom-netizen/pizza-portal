import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

export function getPool(): mysql.Pool {
  if (!global._mysqlPool) {
    global._mysqlPool = mysql.createPool({
      host: process.env.MYSQL_HOST || "localhost",
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "adpizzahub",
      waitForConnections: true,
      connectionLimit: 5,
      maxIdle: 2,
      idleTimeout: 15000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return global._mysqlPool;
}

export function isDbConfigured(): boolean {
  return Boolean(
    process.env.MYSQL_DATABASE ||
    process.env.DATABASE_URL ||
    process.env.MYSQL_HOST
  );
}

export const isMongoConfigured = isDbConfigured;

export async function connectDB(): Promise<mysql.Pool> {
  return getPool();
}

export function isValidId(id: unknown): boolean {
  if (id === null || id === undefined) return false;
  const s = String(id).trim();
  return /^\d+$/.test(s) && Number(s) > 0;
}

export async function query<T = any>(sql: string, values?: any[]): Promise<T> {
  const p = getPool();
  const [rows] = await p.query(sql, values);
  return rows as T;
}

export async function execute<T = any>(sql: string, values?: any[]): Promise<T> {
  const p = getPool();
  const [result] = await p.execute(sql, values);
  return result as T;
}
