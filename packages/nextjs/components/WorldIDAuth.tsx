import React, { useState } from "react";
import WorldcoinSvg from "./assets/WorldcoinSvg";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import { CheckCircle } from "lucide-react";
import { notification } from "~~/utils/scaffold-eth";

interface WorldIDVerificationProps {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: string;
  signal?: string;
}

const WorldIDAuth = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const handleVerify = async (proof: WorldIDVerificationProps): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/worldcoin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proof),
      });

      const data = await response.json();
      console.log(data);
      if (data.code === "success") {
        notification.success("Successfully verified with World ID!");
        setIsVerified(true);
        onSuccess?.();
      } else {
        notification.error("Verification failed. Please try again.");
      }
    } catch (error) {
      notification.error("Error during verification. Please try again.");
      console.error("Error during verification:", error);
    } finally {
      setLoading(false);
    }
  };
  const VerificationContent = () => (
    <IDKitWidget
      app_id={`app_${process.env.NEXT_PUBLIC_WLD_APP_ID}`}
      action={process.env.NEXT_PUBLIC_WC_ACTION || ""}
      onSuccess={(result: ISuccessResult) => console.log(result)}
      handleVerify={handleVerify}
      verification_level={VerificationLevel.Device}
    >
      {({ open }: { open: () => void }) => (
        <button
          onClick={open}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 shadow-blue-500/25 w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg transition"
        >
          {loading ? <span className="loading loading-spinner"></span> : "Verify with World ID"}
        </button>
      )}
    </IDKitWidget>
  );

  return !isVerified ? <VerificationContent /> : <VerificationSuccess method="World ID" />;
};

export default WorldIDAuth;

const VerificationSuccess = ({ method }: { method: "DID" | "World ID" }) => {
  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <WorldcoinSvg className="w-8 h-8" />
          <h2 className="text-xl font-semibold m-0">Verified with {method}</h2>
        </div>
      </div>
    </div>
  );
};
