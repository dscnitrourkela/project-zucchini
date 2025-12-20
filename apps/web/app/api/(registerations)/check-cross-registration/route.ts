import { NextRequest } from "next/server";
import { checkCrossRegistration } from "@repo/database";
import { handleResponse, handleApiError, requireAuth } from "@repo/shared-utils/server";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const result = await checkCrossRegistration(auth.uid);
    return handleResponse(result);
  } catch (error) {
    return handleApiError(error, "Failed to check registration status");
  }
}
