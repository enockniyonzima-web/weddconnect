import "server-only";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

/**
 * Internal account operations used by trusted server code (sign-up, first Google login,
 * IremboPay checkout). These are NOT server actions and cannot be called from the browser.
 * Never re-export them from a `"use server"` file.
 */

export async function createUserRecord(data: Prisma.UserCreateInput) {
     const user = await prisma.user.create({ data, select: { id: true, email: true } });
     RevalidatePages.user();
     return user;
}

export async function setUserType(userId: string, type: string) {
     const user = await prisma.user.update({ where: { id: userId }, data: { type }, select: { id: true } });
     RevalidatePages.user();
     return user;
}

export async function createClientRecord(data: { name: string; phone: string; userId: string }) {
     const client = await prisma.client.create({
          data: { name: data.name, phone: data.phone, user: { connect: { id: data.userId } } },
          select: { id: true, name: true, phone: true },
     });
     RevalidatePages.client();
     return client;
}

export async function updateClientPhone(clientId: number, phone: string) {
     const client = await prisma.client.update({
          where: { id: clientId },
          data: { phone },
          select: { id: true, name: true, phone: true },
     });
     RevalidatePages.client();
     return client;
}
