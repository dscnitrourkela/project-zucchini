import { NextRequest } from "next/server";
import { registerMunUser } from "@repo/database";
import { handleResponse, handleApiError, requireAuth } from "@repo/shared-utils/server";
import { type MunRegistration } from "@repo/shared-types";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const body: MunRegistration = await request.json();

    if (body.dateOfBirth && typeof body.dateOfBirth === "string") {
      body.dateOfBirth = new Date(body.dateOfBirth);
    }

    const result = await registerMunUser(body, auth.uid);
    return handleResponse(result, 201);
  } catch (error) {
    return handleApiError(error, "MUN registration failed");
  }
}
