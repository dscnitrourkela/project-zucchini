import { UserData } from "@/app/(public)/register/page";
import RegistrationPaymentButton from "@/components/registration/registration-payment-button";

interface PaymentStepProps {
  userData: UserData;
  paymentError: string | null;
  onPaymentFailure: (errorMessage: string) => void;
}

export function PaymentStep({ userData, paymentError, onPaymentFailure }: PaymentStepProps) {
  return (
    <div className="py-6 flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-white font-baloo mb-2">
          Initial Registration Successful
        </h2>
        <p className="text-white font-inria mb-6">
          Complete your payment to confirm your registration
        </p>
      </div>

      {paymentError && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {paymentError}
        </div>
      )}

      <div className="max-w-md mx-auto">
        <RegistrationPaymentButton
          userName={userData.name}
          userEmail={userData.email}
          onPaymentFailure={onPaymentFailure}
        />
      </div>
    </div>
  );
}
