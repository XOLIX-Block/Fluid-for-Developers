# Passkeys & WebAuthn Integration Guide (QSC-4900)

Traditional seed phrases (12/24 words) create friction and user drop-off. On **XOLIX FLUID**, developers can onboard users with zero seed phrases using **WebAuthn Biometric Passkeys (FaceID, TouchID, Windows Hello, and YubiKeys)** coupled with the **QSC-4900 Smart Passkey Account Standard**.

---

## 1. How It Works

```
[User Browser / Device]
       │ (Prompts FaceID / TouchID)
       ▼
[Hardware Secure Enclave (P-256 Keypair)]
       │ (Signs Challenge)
       ▼
[Passkey Signature Payload]
       │
       ▼
[Micro-Fee Gas Sponsorship Matrix]
       │ (Sponsors gas fees for zero-balance users)
       ▼
[QSC-4900 Smart Account Contract]
       │ (Verifies secp256r1 signature on-chain)
       ▼
[Executed Blockchain Action]
```

---

## 2. Registering a Passkey Smart Account

```typescript
// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.

export async function createPasskeySmartAccount(username: string) {
  // 1. Request hardware key generation via WebAuthn API
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      rp: { name: "XOLIX Web3 Application", id: window.location.hostname },
      user: {
        id: crypto.getRandomValues(new Uint8Array(16)),
        name: username,
        displayName: username,
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }], // ES256 (secp256r1)
      authenticatorSelection: {
        authenticatorAttachment: "platform", // FaceID / TouchID / Windows Hello
        userVerification: "required",
      },
      timeout: 60000,
    },
  }) as PublicKeyCredential;

  if (!credential) throw new Error("Passkey creation failed or cancelled by user");

  // 2. Deploy or register QSC-4900 Smart Account referencing this public key
  const response = await fetch("https://rpc.xolix.io/api/smart-account/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      credentialId: credential.id,
      rawPublicKey: Buffer.from(credential.rawId).toString("hex"),
    }),
  });

  const { smartAccountAddress } = await response.json();
  console.log(`QSC-4900 Smart Account Deployed: ${smartAccountAddress}`);
  return { smartAccountAddress, credentialId: credential.id };
}
```

---

## 3. Signing Transactions with Biometrics & Zero-Gas Sponsorship

Users without any native `FLUID` can execute transactions using the **Micro-Fee Gas Sponsorship Matrix**:

```typescript
// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.

export async function executeSponsoredTransaction(
  smartAccountAddress: string,
  credentialId: string,
  callData: { to: string; value: string; data: string }
) {
  // 1. Prepare transaction hash challenge
  const challenge = crypto.getRandomValues(new Uint8Array(32));

  // 2. Prompt biometric authentication
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge,
      allowCredentials: [{ id: Buffer.from(credentialId, "hex"), type: "public-key" }],
      userVerification: "required",
    },
  }) as PublicKeyCredential;

  // 3. Dispatch to Gas Matrix for free user execution
  const res = await fetch("https://rpc.xolix.io/api/sponsorTx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      smartAccountAddress,
      callData,
      passkeyAssertion: {
        clientDataJSON: Buffer.from((assertion.response as any).clientDataJSON).toString("base64"),
        authenticatorData: Buffer.from((assertion.response as any).authenticatorData).toString("base64"),
        signature: Buffer.from((assertion.response as any).signature).toString("base64"),
      },
    }),
  });

  const receipt = await res.json();
  console.log(`Transaction successfully sponsored & executed: ${receipt.txHash}`);
  return receipt;
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
