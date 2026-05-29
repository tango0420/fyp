// lib/esewa.ts
// eSewa payment helper
// Test credentials:
//   Merchant ID: EPAYTEST
//   Secret Key:  8gBm/:&EnhH.1[q
//   Test URL:    https://rc-epay.esewa.com.np/api/epay/main/v2/form

import crypto from "crypto";

/**
 * Generate HMAC-SHA256 signature required by eSewa v2
 * Message format: "total_amount=X,transaction_uuid=Y,product_code=Z"
 */
export function generateEsewaSignature({
  totalAmount,
  transactionUuid,
  productCode,
}: {
  totalAmount: number;
  transactionUuid: string;
  productCode: string;
}): string {
  const secretKey = process.env.ESEWA_SECRET_KEY!;
  
  // IMPORTANT: eSewa expects the exact string with no spaces
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  
  console.log("eSewa signing message:", message);      // add temporarily to debug
  console.log("eSewa secret key:", secretKey);         // add temporarily to debug
  
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");
    
  return signature;
}

/**
 * Verify eSewa payment after redirect
 * eSewa sends back a base64-encoded response — decode and verify signature
 */
export function verifyEsewaResponse(encodedResponse: string): {
  valid: boolean;
  data: Record<string, string> | null;
} {
  try {
    const decoded = Buffer.from(encodedResponse, "base64").toString("utf-8");
    const data = JSON.parse(decoded) as Record<string, string>;

    // Verify signature
    const { total_amount, transaction_uuid, product_code, signed_field_names, signature } = data;

    const secretKey = process.env.ESEWA_SECRET_KEY!;
    const fields = signed_field_names.split(",");
    const message = fields.map((f) => `${f}=${data[f]}`).join(",");

    const expectedSig = crypto
      .createHmac("sha256", secretKey)
      .update(message)
      .digest("base64");

    const valid = expectedSig === signature && data.status === "COMPLETE";
    return { valid, data };
  } catch {
    return { valid: false, data: null };
  }
}