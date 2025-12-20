import { NextRequest } from "next/server";
import { handleResponse, handleApiError, requireAuth } from "@repo/shared-utils/server";
import { isAdmin } from "@repo/database";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);

    if (!auth.email) {
      return handleApiError(new Error("Email not found in token"), "Invalid token");
    }

    const result = await isAdmin(auth.email);
    return handleResponse({ amIAdmin: result });
  } catch (error) {
    return handleApiError(error, "Invalid request");
  }
}
