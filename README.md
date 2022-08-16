# DataWithTrust - TrustData.js for DFFT

- 信頼性のあるデータ(DataWithTrust)、信頼性のある自由なデータ流通(DFFT)を実現するシンプルなJavaScript ESモジュールです
- a simple JavaScript ES module for DataWithTrust / DFFT
- 使用技術 libs: [Ed25519](https://ja.wikipedia.org/wiki/%E3%82%A8%E3%83%89%E3%83%AF%E3%83%BC%E3%82%BA%E6%9B%B2%E7%B7%9A%E3%83%87%E3%82%B8%E3%82%BF%E3%83%AB%E7%BD%B2%E5%90%8D%E3%82%A2%E3%83%AB%E3%82%B4%E3%83%AA%E3%82%BA%E3%83%A0), [X25519](https://ja.wikipedia.org/wiki/Curve25519), [AES-GCM](https://ja.wikipedia.org/wiki/Galois/Counter_Mode) (*[TLS](https://ja.wikipedia.org/wiki/Transport_Layer_Security)1.3推奨技術)

## 電子署名による信頼性のあるデータ流通

```js
import { TrustData } from "https://code4fukui.github.io/DataWithTrust/TrustData.js";
// ユーザー作成 (DIDとシークレット)
const user = TrustData.createUser();
console.log(user.did); // 公開してOK！ DID = 分散型ID = 公開鍵
console.log(user.secret); // 秘密にしないといけない秘密鍵

// 電子署名付きの信頼性のあるデータを生成
const bin = TrustData.encode("test", user);

// 受取時に電子署名を検証 (改竄があれば例外が発生)
const res = TrustData.decode(bin);
console.log(res.payload); // "test"
```

## 指定ユーザのみ読める、暗号化された信頼性のあるデータ流通

```js
import { TrustData } from "https://code4fukui.github.io/DataWithTrust/TrustData.js";
const user1 = TrustData.createUser();
const user2 = TrustData.createUser();
const bin = TrustData.encode("test", user1, user2.did); // 相手のDIDで暗号化

// ユーザ2
const bin2 = TrustData.decode(bin, user2); // 自分の鍵で復号化
console.log(bin2.payload); // "test"
```

## 任意のデータを入れることが可能

```js
const json = { abc: "ABC", num: 123456, bin: new Uint8Array([1, 2, 3])};
const bin = TrustData.encode(json, user);
const res = TrustData.decode(bin);
console.log(res.payload);
```

## 更新前データを含んだ信頼性のあるデータ更新の実装例

```js
import { TrustData } from "https://code4fukui.github.io/DataWithTrust/TrustData.js";
// ユーザ1による作成
const user1 = TrustData.createUser();
const bin1 = TrustData.encode("test1", user1);
// ユーザ2による更新
const user2 = TrustData.createUser();
const bin2 = TrustData.encode(["test2", bin1], user2);

// 検証
const res2 = TrustData.decode(bin2);
const res1 = TrustData.decode(res2.payload[1]);
console.log(res1.payload); // "test1"
```
