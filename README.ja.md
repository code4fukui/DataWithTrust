# DataWithTrust - TrustData.js for DFFT

DataWithTrustは、信頼できるデータ転送を実現するためのシンプルなJavaScript ESモジュールです。

## 主な機能
- デジタル署名による信頼できるデータ転送
- 特定のユーザーのための暗号化データ転送
- 任意のデータ形式(JSON、バイナリなど)の対応
- 前のデータを含む信頼できるデータの更新

## 必要環境
- [Ed25519](https://en.wikipedia.org/wiki/EdDSA), [X25519](https://en.wikipedia.org/wiki/Curve25519), および [AES-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) (TLS 1.3 用に推奨)

## 使い方

### デジタル署名による信頼できるデータ転送
```js
import { TrustData } from "https://code4fukui.github.io/DataWithTrust/TrustData.js";
// ユーザーの作成 (DIDと秘密鍵)
const user = TrustData.createUser();
console.log(user.did); // 公開DID (Decentralized Identifier)
console.log(user.secret); // 秘密鍵 (機密に保つ!)

// デジタル署名付きのデータ生成
const bin = TrustData.encode("test", user);

// 受信時の署名検証 (改ざんされた場合は例外)
const res = TrustData.decode(bin);
console.log(res.payload); // "test"
```

### 特定ユーザーのための暗号化データ転送
```js
import { TrustData } from "https://code4fukui.github.io/DataWithTrust/TrustData.js";
const user1 = TrustData.createUser();
const user2 = TrustData.createUser();
const bin = TrustData.encode("test", user1, user2.did); // user2向けに暗号化

// user2
const bin2 = TrustData.decode(bin, user2); // 自身の鍵で復号
console.log(bin2.payload); // "test"
```

## ライセンス
[MIT License](LICENSE)