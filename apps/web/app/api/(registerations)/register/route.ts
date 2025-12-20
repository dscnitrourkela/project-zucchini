import { NextRequest } from "next/server";
import { registerUser } from "@repo/database";
import { handleResponse, handleApiError, requireAuth } from "@repo/shared-utils/server";
import { type Registration } from "@repo/shared-types";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const body: Registration = await request.json();
    const result = await registerUser(body, auth.uid);
    return handleResponse(result, 201);
  } catch (error) {
    return handleApiError(error, "Registration failed");
  }
}
