"use client";

import { useState } from "react";
import Script from "next/script";
import { useApi } from "@repo/shared-utils";
import { Loader2 } from "lucide-react";

interface RegistrationPaymentButtonProps {
  userName: string;
  userEmail: string;
  onPaymentSuccess?: () => void;
  onPaymentFailure?: (error: string) => void;
}

export default function RegistrationPaymentButton({
  userName,
  userEmail,
  onPaymentSuccess,
  onPaymentFailure,
}: RegistrationPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const initiateOrderApi = useApi<{ orderId: string }>();
  const verifyOrderApi = useApi();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const orderResult = await initiateOrderApi.execute("intiate-order", { method: "POST" });

      if (!orderResult?.orderId) {
        onPaymentFailure?.(initiateOrderApi.error || "Failed to create order");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        name: "NITRUTSAV 2026",
        description: "Registration for NITRUTSAV 2026",
        order_id: orderResult.orderId,
        handler: async function (response: any) {
          const verifyResult = await verifyOrderApi.execute("verify-order", {
            method: "POST",
            body: JSON.stringify({
              razorpay_order_id: orderResult.orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (verifyResult) {
            onPaymentSuccess?.();
          } else {
            onPaymentFailure?.(verifyOrderApi.error || "Payment verification failed");
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        onPaymentFailure?.("Payment failed. Please try again.");
        console.error(response.error);
      });
      razorpay.open();
    } catch (error) {
      onPaymentFailure?.("Failed to initiate payment. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={isLoading || initiateOrderApi.loading || verifyOrderApi.loading}
        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading || initiateOrderApi.loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          "Proceed to Payment"
        )}
      </button>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
