import CryptoJS from 'crypto-js';

// SECRET SHOULD BE PROVIDED BY BACKEND (e.g. injected via init or securely fetched)
// In this mock, we use a constant to demonstrate the HMAC generation.
const MOCK_SECRET_KEY = "sprut-escrow-v2-super-secret-key-32bytes!";

export interface QRCodePayload {
  lotId: string;
  amountUsd: number;
  expiresAt: number; // Unix timestamp
  seed: string; // Random seed to prevent replay
}

export interface SignedQRPayload {
  payload: QRCodePayload;
  signature: string;
}

export function generateDynamicQR(lotId: string, amountUsd: number, ttlSeconds: number = 180): SignedQRPayload {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const seed = CryptoJS.lib.WordArray.random(16).toString(); // 16 bytes random hex
  
  const payload: QRCodePayload = {
    lotId,
    amountUsd,
    expiresAt,
    seed
  };

  const payloadString = JSON.stringify(payload);
  const signature = CryptoJS.HmacSHA256(payloadString, MOCK_SECRET_KEY).toString(CryptoJS.enc.Hex);

  return {
    payload,
    signature
  };
}
