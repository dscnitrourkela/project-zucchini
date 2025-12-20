import { NextRequest } from "next/server";
import { getMunRegistrationFee } from "@repo/database";
import { handleResponse, handleApiError, requireAuth } from "@repo/shared-utils/server";
import { createOrder } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const { studentType, committeeChoice } = await request.json();

    if (!studentType || !committeeChoice) {
      return handleApiError(
        new Error("Student type and committee choice are required"),
        "Invalid request"
      );
    }

    const amount = getMunRegistrationFee(studentType, committeeChoice);
    const order = await createOrder({ amount, receipt: `mun#${Date.now()}` });
    return handleResponse({ orderId: order.id, amount });
  } catch (error) {
    return handleApiError(error, "Failed to create MUN order");
  }
}
