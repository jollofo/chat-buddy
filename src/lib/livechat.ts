import * as LC from '@livechat/customer-sdk';

let sdk: ReturnType<typeof LC.init> | null = null;

export function getCustomerSDK() {
  if (sdk) return sdk;

  const cfg = {
    organizationId: process.env.NEXT_PUBLIC_LC_ORG!,
    clientId: process.env.NEXT_PUBLIC_LC_CLIENT!,
    redirectUri:
      (typeof window !== 'undefined' ? window.location.origin : '') +
      (process.env.NEXT_PUBLIC_REDIRECT_PATH || '/auth/callback'),
  };

  const initFn: any = (LC as any).init;
  // Some older/bad typings expect (config, env, licenseId)
  if (typeof initFn === 'function' && initFn.length >= 3) {
    const licenseId = Number(process.env.NEXT_PUBLIC_LC_LICENSE_ID || '0');
    sdk = initFn(cfg, undefined, licenseId);
  } else {
    sdk = initFn(cfg);
  }
  return sdk!;
}
