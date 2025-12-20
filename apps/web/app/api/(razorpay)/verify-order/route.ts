import { NextRequest } from "next/server";
import { updatePaymentStatus, getUserByFirebaseUid } from "@repo/database";
import { handleResponse, handleApiError, requireAuth } from "@repo/shared-utils/server";
import { verifyPaymentSignature, type RazorpayDetails } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return handleApiError(
        new Error("Missing required parameters"),
        "Missing required parameters"
      );
    }

    const user = await getUserByFirebaseUid(auth.uid);
    if (!user) {
      return handleApiError(new Error("User not found"), "User not found");
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

    const result = await updatePaymentStatus(user.id, "razorpay", details);
    return handleResponse(result);
  } catch (error) {
    return handleApiError(error, "Payment verification failed");
  }
}
