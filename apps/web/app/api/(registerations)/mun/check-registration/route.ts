import { NextRequest } from "next/server";
import { getMunUserByFirebaseUid } from "@repo/database";
import { handleResponse, handleApiError, requireAuth } from "@repo/shared-utils/server";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const munUser = await getMunUserByFirebaseUid(auth.uid);

    if (!munUser) {
      return handleResponse({ isRegistered: false });
    }

    return handleResponse({
      isRegistered: true,
      userId: munUser.id,
      name: munUser.name,
      email: munUser.email,
      isPaymentVerified: munUser.isPaymentVerified,
    });
  } catch (error) {
    return handleApiError(error, "Failed to check MUN registration status");
  }
}
