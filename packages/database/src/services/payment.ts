import { db } from "../index";
import { usersTable, transactionsTable, munRegistrationsTable } from "../schema";
import { eq } from "drizzle-orm";
import { ApiError } from "@repo/shared-types";

export type TransactionType = "NITRUTSAV" | "MUN";

export const getTxnIdByFirebaseUid = async (firebaseUid: string): Promise<string | null> => {
  const [result] = await db
    .select({ txnId: transactionsTable.txnId })
    .from(usersTable)
    .innerJoin(transactionsTable, eq(usersTable.id, transactionsTable.userId))
    .where(eq(usersTable.firebaseUid, firebaseUid));

  return result?.txnId || null;
};

export const updatePaymentStatusByTxnId = async (txnId: string, isVerified: boolean) => {
  return await db.transaction(async (tx) => {
    const [transaction] = await tx
      .update(transactionsTable)
      .set({ isVerified })
      .where(eq(transactionsTable.txnId, txnId))
      .returning();

    if (!transaction || !transaction.userId) {
      throw new ApiError(400, "Transaction has no associated user");
    }

    const [user] = await tx
      .update(usersTable)
      .set({ isVerified })
      .where(eq(usersTable.id, transaction.userId))
      .returning();
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return true;
  });
};

function generateTxnId(type: TransactionType): string {
  const prefix = type === "NITRUTSAV" ? "NU26" : "MUN26";
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
}

export const createTransaction = async (
  type: TransactionType,
  amount: number,
  userId?: number,
  teamId?: string
) => {
  if (!userId && !teamId) {
    throw new ApiError(400, "Either userId or teamId is required");
  }

  const [existingTransaction] = await db
    .select()
    .from(transactionsTable)
    .where(userId ? eq(transactionsTable.userId, userId) : eq(transactionsTable.teamId, teamId!));

  if (existingTransaction) {
    if (existingTransaction.isVerified) {
      return existingTransaction;
    }
    await db.delete(transactionsTable).where(eq(transactionsTable.id, existingTransaction.id));
  }

  const txnId = generateTxnId(type);

  const [transaction] = await db
    .insert(transactionsTable)
    .values({
      userId: userId || null,
      teamId: teamId || null,
      txnId,
      type,
      amount,
      isVerified: false,
    })
    .returning();

  return transaction;
};

export const getTransactionByTxnId = async (txnId: string) => {
  const [transaction] = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.txnId, txnId));

  return transaction || null;
};

export const updatePaymentStatus = async (userId: number, amount: number) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const txnId = generateTxnId("NITRUTSAV");

  await db.update(usersTable).set({ isVerified: true }).where(eq(usersTable.id, userId));

  const [transaction] = await db
    .insert(transactionsTable)
    .values({
      userId,
      txnId,
      type: "NITRUTSAV",
      amount,
      isVerified: true,
    })
    .returning();

  if (!transaction) {
    throw new ApiError(500, "Failed to create transaction");
  }

  return {
    message: "Payment verified successfully",
    txnId: transaction.txnId,
  };
};

export const getPaymentStatus = async (userId: number) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const [transaction] = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, userId));

  if (!transaction) {
    return {
      isVerified: false,
      txnId: null,
      amount: null,
    };
  }

  return {
    isVerified: transaction.isVerified,
    txnId: transaction.txnId,
    amount: transaction.amount,
  };
};

export const updateMunPaymentStatus = async (munRegistrationId: number, amount: number) => {
  const [munUser] = await db
    .select()
    .from(munRegistrationsTable)
    .where(eq(munRegistrationsTable.id, munRegistrationId));

  if (!munUser) {
    throw new ApiError(404, "MUN registration not found");
  }

  const teamId = munUser.teamId || munUser.firebaseUid || `individual-${munUser.id}`;
  const txnId = generateTxnId("MUN");

  if (munUser.teamId) {
    await db
      .update(munRegistrationsTable)
      .set({ isVerified: true })
      .where(eq(munRegistrationsTable.teamId, munUser.teamId));
  } else {
    await db
      .update(munRegistrationsTable)
      .set({ isVerified: true })
      .where(eq(munRegistrationsTable.id, munRegistrationId));
  }

  const [transaction] = await db
    .insert(transactionsTable)
    .values({
      teamId,
      txnId,
      type: "MUN",
      amount,
      isVerified: true,
    })
    .returning();

  if (!transaction) {
    throw new ApiError(500, "Failed to create transaction");
  }

  return {
    message: "MUN payment verified successfully",
    txnId: transaction.txnId,
  };
};
