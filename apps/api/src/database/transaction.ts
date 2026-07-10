import mongoose, { ClientSession } from "mongoose";
import { logger } from "../utils/logger.util.js";

export async function withTransaction<T>(
  callback: (session: ClientSession) => Promise<T>
): Promise<T> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    logger.error("Transaction aborted", { error });
    throw error;
  } finally {
    session.endSession();
  }
}
