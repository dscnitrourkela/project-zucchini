import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayClient: Razorpay | null = null;

export interface RazorpayCredentials {
  keyId: string;
  keySecret: string;
}

export function getRazorpayCredentials(): RazorpayCredentials {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured");
  }

  return { keyId, keySecret };
}

export function getRazorpayClient(): Razorpay {
  if (razorpayClient) return razorpayClient;

  const { keyId, keySecret } = getRazorpayCredentials();
  razorpayClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return razorpayClient;
}

export interface CreateOrderOptions {
  amount: number;
  receipt: string;
}

export async function createOrder(options: CreateOrderOptions) {
  const razorpay = getRazorpayClient();
  const order = await razorpay.orders.create({
    amount: options.amount * 100,
    currency: "INR",
    receipt: options.receipt,
  });
  return order;
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export function verifyPaymentSignature(params: VerifyPaymentParams): boolean {
  const { keySecret } = getRazorpayCredentials();
  const HMAC = crypto.createHmac("sha256", keySecret);
  HMAC.update(`${params.orderId}|${params.paymentId}`);
  const generatedSignature = HMAC.digest("hex");
  return generatedSignature === params.signature;
}

export interface RazorpayDetails {
  orderId: string;
  paymentId: string;
  signature: string;
}
