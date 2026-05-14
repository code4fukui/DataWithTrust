# DataWithTrust - TrustData.js for DFFT

DataWithTrust / DFFT (Decentralized and Fair Data Flow Transaction: 分散型・公平なデータフロー取引) 用のシンプルなJavaScript ESモジュールです。

## 機能
- デジタル署名による信頼性の高いデータ転送
- 特定ユーザー向けのデータ暗号化
- 任意のデータ型（JSON、バイナリなど）のサポート
- 更新データに過去のデータを含めることによるバージョニング

## 要件
- [Ed25519](https://en.wikipedia.org/wiki/EdDSA)、[X25519](https://en.wikipedia.org/wiki/Curve25519)、および[AES-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)（TLS 1.3で推奨）

## 使い方

### デジタル署名による信頼性の高いデータ転送
```js
import { TrustData } from "https://code4fukui.github.io/DataWithTrust/TrustData.js";
// ユーザーを作成（DIDとシークレット）
const user = TrustData.createUser();
console.log(user.did); // 公開DID（分散型識別子）
console.log(user.secret); // 秘密鍵（厳重に保管してください！）

// デジタル署名付きデータの生成
const bin = TrustData.encode("test", user);

// 受信時に署名を検証（改ざんされている場合は例外が発生）
const res = TrustData.decode(bin);
console.log(res.payload); // "test"
```

### 特定ユーザー向けの暗号化データ転送
```js
import { TrustData } from "https://code4fukui.github.io/DataWithTrust/TrustData.js";
const user1 = TrustData.createUser();
const user2 = TrustData.createUser();
const bin = TrustData.encode("test", user1, user2.did); // user2向けに暗号化

// User2
const bin2 = TrustData.decode(bin, user2); // 自身の鍵で復号
console.log(bin2.payload); // "test"
```

### 任意のデータの保存
```js
const json = { abc: "ABC", num: 123456, bin: new Uint8Array([1, 2, 3]) };
const bin = TrustData.encode(json, user);
const res = TrustData.decode(bin);
console.log(res.payload);
```

### 過去のデータを含めた信頼性の高いデータ更新
```js
import { TrustData } from "https://code4fukui.github.io/DataWithTrust/TrustData.js";
// user1が作成
const user1 = TrustData.createUser();
const bin1 = TrustData.encode("test1", user1);
// user2が更新
const user2 = TrustData.createUser();
const bin2 = TrustData.encode(["test2", bin1], user2);

// 検証
const res2 = TrustData.decode(bin2);
const res1 = TrustData.decode(res2.payload[1]);
console.log(res1.payload); // "test1"
```

## ライセンス
MIT License — 詳細は[LICENSE](LICENSE)を参照してください。
