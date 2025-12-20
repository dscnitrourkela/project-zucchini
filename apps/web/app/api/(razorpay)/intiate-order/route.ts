import { NextRequest } from "next/server";
import { amount } from "../../../../config";
import { handleResponse, handleApiError, requireAuth } from "@repo/shared-utils/server";
import { createOrder } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const order = await createOrder({ amount, receipt: `receipt#NU26#${Date.now()}` });
    return handleResponse({ orderId: order.id });
  } catch (error) {
    return handleApiError(error, "Failed to create order");
  }
}
