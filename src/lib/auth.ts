import { jwtVerify, createRemoteJWKSet, importJWK, JWK } from "jose";

export async function verifyEventSignature(token: string) {
  try {
    const jwkEnv = process.env.EVENT_JWS_JWK;
    if (!jwkEnv) return true; // not enabled
    const jwk = JSON.parse(jwkEnv) as JWK;
    const key = await importJWK(jwk, jwk.kty === "oct" ? "HS256" : undefined);
    await jwtVerify(token, key);
    return true;
  } catch (e) {
    return false;
  }
}