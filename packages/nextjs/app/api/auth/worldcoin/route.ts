import { NextRequest, NextResponse } from "next/server";

interface VerificationRequestBody {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: string;
  signal?: string;
}

interface VerificationResponse {
  code: "success" | "failure";
  wldResponse: any; // Extend this type based on the actual World ID API response
}

const endpoint = `https://developer.worldcoin.org/api/v1/verify/app_${process.env.NEXT_PUBLIC_WLD_APP_ID}`;

export async function POST(req: NextRequest): Promise<NextResponse<VerificationResponse>> {
  try {
    const body: VerificationRequestBody = await req.json();

    const reqBody = {
      merkle_root: body.merkle_root,
      nullifier_hash: body.nullifier_hash,
      proof: body.proof,
      verification_level: body.verification_level,
      signal: body.signal ?? "",
      action: process.env.NEXT_PUBLIC_WC_ACTION,
    };

    const verifyRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    const wldResponse = await verifyRes.json();

    if (verifyRes.status === 200) {
      return NextResponse.json({
        code: "success",
        wldResponse,
      });
    } else {
      return NextResponse.json({
        code: "failure",
        wldResponse,
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({
      code: "failure",
      wldResponse: { error: "Internal server error" },
    });
  }
}
