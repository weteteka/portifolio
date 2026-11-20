import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getUsers, saveUsers } from "./db";
import { User } from "@/types/portfolio";

const SESSION_COOKIE = "portfolio_admin_token";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "portfolio-super-secret-key-change-in-prod-xyz123";

interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  exp: number;
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

function signPayload(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

function verifyToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const expected = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
    if (signature !== expected) return null;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8")) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(user: { id: string; email: string; name: string }): Promise<void> {
  const cookieStore = await cookies();
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const token = signPayload({
    userId: user.id,
    email: user.email,
    name: user.name,
    exp,
  });

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function getSessionUser(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function ensureInitialAdmin(): Promise<void> {
  const users = await getUsers();
  if (users.length === 0) {
    // Seed default admin account: admin@portfolio.com / admin123
    const defaultPasswordHash = await hashPassword("admin123");
    const defaultAdmin: User = {
      id: "admin-default",
      name: "Administrador",
      email: "admin@portfolio.com",
      passwordHash: defaultPasswordHash,
      createdAt: new Date().toISOString(),
    };
    await saveUsers([defaultAdmin]);
  }
}
