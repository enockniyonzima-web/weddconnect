import "server-only";

import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/common/authOptions";
import prisma from "@/lib/prisma";

/**
 * Authorization helpers for Server Actions and Route Handlers.
 *
 * IMPORTANT: every exported function in a `"use server"` file is a public HTTP endpoint that
 * anyone can call with any arguments — hiding a button or protecting a page layout does NOT
 * protect the action. Every action must therefore check the caller itself using these helpers.
 *
 *   requireAdmin()            → admin-only mutations and admin-only reads
 *   requireUser()             → any signed-in user
 *   requireClientAccess(id)   → the client who owns the record, or an admin
 *   scopePublicQuery(...)     → public reads: strips sensitive fields for non-admin callers
 */

export class AuthorizationError extends Error {
     constructor(message = "Not authorized") {
          super(message);
          this.name = "AuthorizationError";
     }
}

/** The signed-in user (or null), resolved once per request. Disabled users are treated as signed out. */
export const getAuthContext = cache(async () => {
     const session = await getServerSession(authOptions);
     const email = session?.user?.email;
     if (!email) return null;

     const user = await prisma.user.findUnique({
          where: { email },
          select: {
               id: true,
               email: true,
               status: true,
               admin: { select: { id: true, type: true } },
               client: { select: { id: true } },
               vendor: { select: { id: true } },
          },
     });
     if (!user || !user.status) return null;
     return user;
});

export type TAuthUser = NonNullable<Awaited<ReturnType<typeof getAuthContext>>>;

export async function requireUser(): Promise<TAuthUser> {
     const user = await getAuthContext();
     if (!user) throw new AuthorizationError("Not authenticated");
     return user;
}

export async function requireAdmin(): Promise<TAuthUser> {
     const user = await getAuthContext();
     if (!user?.admin) throw new AuthorizationError("Admin access required");
     return user;
}

/** Allows the client who owns `clientId`, or any admin. */
export async function requireClientAccess(clientId: number): Promise<TAuthUser> {
     const user = await requireUser();
     if (user.admin || user.client?.id === clientId) return user;
     throw new AuthorizationError("Not allowed to access this client");
}

/**
 * Vendor listings (including vendor contacts) are the paid content of the platform: only admins
 * and clients with a non-expired subscription may read them. Mirrors the check in
 * `src/app/(sacred)/posts/layout.tsx`.
 */
export async function requireSubscriberOrAdmin(): Promise<TAuthUser> {
     const user = await requireUser();
     if (user.admin) return user;
     if (!user.client) throw new AuthorizationError("Active subscription required");
     const sub = await prisma.clientSubscription.findUnique({
          where: { clientId: user.client.id },
          select: { expiryAt: true },
     });
     if (!sub?.expiryAt || sub.expiryAt <= new Date()) throw new AuthorizationError("Active subscription required");
     return user;
}

export async function isAdmin(): Promise<boolean> {
     const user = await getAuthContext();
     return !!user?.admin;
}

// ---------------------------------------------------------------------------------------------
// Public read scoping
// ---------------------------------------------------------------------------------------------

/** Fields/relations a non-admin caller may never select, filter or sort on. */
const PUBLIC_DENIED_KEYS = new Set([
     // credentials & tokens
     "password", "accounts", "accessToken", "refreshToken", "token", "verificationCode",
     // payments & subscriptions
     "transactions", "clientSubscriptions", "subscription", "payNumber", "proof", "invoiceNumber",
     // personal data
     "phone",
     // admin structure
     "admin", "role", "roles", "permissions",
]);

/** Additionally denied in `where` / `orderBy` so data cannot be inferred by filtering. */
const PUBLIC_DENIED_FILTER_KEYS = new Set([...PUBLIC_DENIED_KEYS, "email"]);

/** Maximum page size for non-admin callers. */
export const MAX_PUBLIC_TAKE = 100;

function isPlainObject(value: unknown): value is Record<string, unknown> {
     if (value === null || typeof value !== "object") return false;
     const proto = Object.getPrototypeOf(value);
     return proto === Object.prototype || proto === null;
}

function stripKeys<T>(value: T, denied: Set<string>): T {
     if (Array.isArray(value)) return value.map((v) => stripKeys(v, denied)) as T;
     if (!isPlainObject(value)) return value;
     const out: Record<string, unknown> = {};
     for (const [key, v] of Object.entries(value)) {
          if (denied.has(key)) continue;
          const stripped = stripKeys(v, denied);
          // If stripping emptied a nested object (e.g. `_count: { select: { clientSubscriptions: true } }`),
          // drop the key entirely — Prisma rejects empty `select` objects.
          if (isPlainObject(v) && Object.keys(v).length > 0 && isPlainObject(stripped) && Object.keys(stripped).length === 0) continue;
          out[key] = stripped;
     }
     return out as T;
}

/** Reduces any `email` value in a result to its local part (e.g. "jane" for "jane@x.com"). */
function maskEmails<T>(value: T): T {
     if (Array.isArray(value)) return value.map(maskEmails) as T;
     if (!isPlainObject(value)) return value;
     const out: Record<string, unknown> = {};
     for (const [key, v] of Object.entries(value)) {
          out[key] = key === "email" && typeof v === "string" ? v.split("@")[0] : maskEmails(v);
     }
     return out as T;
}

/**
 * Makes a caller-supplied Prisma query safe for public read actions.
 * Admins get the query unchanged; everyone else gets sensitive fields removed from
 * select/where/orderBy, a capped page size, and e-mail addresses masked in the result.
 */
export async function scopePublicQuery<S, W, O>(query: { select: S; where?: W; orderBy?: O; take?: number }) {
     const admin = await isAdmin();
     if (admin) {
          return { admin, ...query, mask: <R,>(result: R): R => result };
     }
     return {
          admin,
          select: stripKeys(query.select, PUBLIC_DENIED_KEYS),
          where: stripKeys(query.where, PUBLIC_DENIED_FILTER_KEYS),
          orderBy: stripKeys(query.orderBy, PUBLIC_DENIED_FILTER_KEYS),
          take: Math.min(Math.max(query.take ?? MAX_PUBLIC_TAKE, 0), MAX_PUBLIC_TAKE),
          mask: maskEmails,
     };
}
