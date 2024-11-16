import { CheckCircle } from "lucide-react";

export const VerificationSuccess = ({ method }: { method: "DID" | "World ID" }) => {
  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
          <h2 className="text-xl font-semibold">Verified with {method}</h2>
        </div>
        <p className="">Your identity has been successfully verified</p>
      </div>
    </div>
  );
};
