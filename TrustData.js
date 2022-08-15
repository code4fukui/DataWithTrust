import { Ed25519 } from "https://code4fukui.github.io/Ed25519/Ed25519.js";
import { CBOR } from "https://js.sabae.cc/CBOR.js";
import { TAI64N } from "https://code4fukui.github.io/TAI64N-es/TAI64N.js";
import { subbin, bincat } from "https://js.sabae.cc/binutil.js";
import { X25519 } from "https://code4fukui.github.io/X25519/X25519.js";
import { convertPublicKey, convertSecretKey as convertPrivateKey } from "https://code4fukui.github.io/ed25519-to-x25519/src/ed2curve.js";

export class TrustData {
  static createUser() {
    const keys = Ed25519.generateKeyPair();
    const did = keys.publicKey;
    const secret = subbin(keys.privateKey, 0, 32);
    return { did, secret };
  }

  static VERSION_ED25519 = 0;
  static encode(user, body, pre = null) {
    const message = CBOR.encode([
      TAI64N.now(), // 12byte
      body,
      pre,
    ]);
    const res = CBOR.encode([
      TrustData.VERSION_ED25519,
      user.did,
      message,
      Ed25519.sign({ privateKey: user.secret, message, encodeing: "binary" }),
    ]);
    return res;
  }
  static decode(bin) {
    const res = CBOR.decode(bin);
    if (res[0] != TrustData.VERSION_ED25519) {
      throw new Error("unsupported version: " + res[0]);
    }
    const publicKey = res[1];
    const message = res[2];
    const signature = res[3];
    const chk = Ed25519.verify({ signature, publicKey, message, encoding: "binary" });
    if (!chk) {
      throw new Error("illegal signature");
    }
    const [ datetime, body, pre] = CBOR.decode(message);
    return { did: publicKey, datetime: TAI64N.toDate(datetime), body, pre };
  }

  static async encrypt(user, did, bin) {
    const sharedKey = X25519.getSharedKey(convertPrivateKey(subbin(user.secret, 0, 32)), convertPublicKey(did));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const buf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await TrustData._importKey(sharedKey), bin);
    const crypt = new Uint8Array(buf);
    return bincat(iv, crypt);
  }
  static async decrypt(user, did, ivcrypt) {
    const sharedKey = X25519.getSharedKey(convertPrivateKey(subbin(user.secret, 0, 32)), convertPublicKey(did));
    const iv = subbin(ivcrypt, 0, 12);
    const crypt = subbin(ivcrypt, 12, ivcrypt.length - 12);
    const buf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, await TrustData._importKey(sharedKey), crypt);
    return new Uint8Array(buf);
  }
  static _importKey = async (key) => {
    const canexport = true;
    return await window.crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-GCM", length: 256 },
      canexport,
      ["encrypt", "decrypt"]
    );
  };
}
