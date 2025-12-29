import { CheckCircle, Home } from "lucide-react";
import Link from "next/link";

export function CompleteStep() {
  return (
    <div className="text-center py-8 max-w-md mx-auto">
      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2 font-baloo">Welcome to NITRUTSAV 2026!</h2>
      <p className="text-white/90 mb-8 font-inria">
        Your registration and payment have been successfully completed
      </p>

      <Link
        href={"/"}
        className="gradient-border-btn w-full mt-6 py-3 px-6 text-white font-semibold hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2 font-inria"
      >
        <Home className="w-5 h-5" />
        Go to Home
      </Link>
    </div>
  );
}
