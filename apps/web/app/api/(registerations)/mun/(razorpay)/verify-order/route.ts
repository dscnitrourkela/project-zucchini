import { NextRequest } from "next/server";
import { updateMunPaymentStatus, getMunUserByFirebaseUid } from "@repo/database";
import { handleResponse, handleApiError, requireAuth } from "@repo/shared-utils/server";
import { verifyPaymentSignature, type RazorpayDetails } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return handleApiError(
        new Error("Missing required parameters"),
        "Missing required parameters"
      );
    }

    if (!amount) {
      return handleApiError(new Error("Amount is required"), "Invalid request");
    }

    const munUser = await getMunUserByFirebaseUid(auth.uid);
    if (!munUser) {
      return handleApiError(new Error("MUN registration not found"), "MUN registration not found");
    }

    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      return handleApiError(new Error("Invalid signature"), "Invalid payment signature");
    }

    const details: RazorpayDetails = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    };

    const result = await updateMunPaymentStatus(munUser.id, amount, "razorpay", details);
    return handleResponse(result);
  } catch (error) {
    return handleApiError(error, "MUN payment verification failed");
  }
}
