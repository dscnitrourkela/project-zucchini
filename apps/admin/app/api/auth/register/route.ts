import { NextRequest } from "next/server";
import { handleResponse, handleApiError, requireAuth } from "@repo/shared-utils/server";
import { registerAdmin, getAdminByUid } from "@repo/database";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);

    if (!auth.uid || !auth.email) {
      return handleApiError(new Error("Invalid token"), "Missing user info");
    }

    const existing = await getAdminByUid(auth.uid);
    if (existing) {
      return handleResponse({
        success: false,
        error: "Already registered",
        isVerified: existing.isVerified,
      });
    }

    const body = await req.json();
    const name = body.name || "Admin";

    const result = await registerAdmin(auth.uid, auth.email, name);

    return handleResponse({
      success: result.success,
      message: result.success
        ? "Registration successful. Please wait for verification."
        : result.error,
      isVerified: result.admin?.isVerified || false,
    });
  } catch (error) {
    return handleApiError(error, "Registration failed");
  }
}
