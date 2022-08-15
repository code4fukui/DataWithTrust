# TrustData.js

信頼できるデータ連携のためのシンプルなライブラリ「TrustData.js」 (with [Ed25519](https://ja.wikipedia.org/wiki/%E3%82%A8%E3%83%89%E3%83%AF%E3%83%BC%E3%82%BA%E6%9B%B2%E7%B7%9A%E3%83%87%E3%82%B8%E3%82%BF%E3%83%AB%E7%BD%B2%E5%90%8D%E3%82%A2%E3%83%AB%E3%82%B4%E3%83%AA%E3%82%BA%E3%83%A0), [X25519](https://ja.wikipedia.org/wiki/Curve25519), [AES-GCM](https://ja.wikipedia.org/wiki/Galois/Counter_Mode) *[TLS](https://ja.wikipedia.org/wiki/Transport_Layer_Security)1.3推奨技術)

## 電子署名による信頼できるデータ連携

```js
import { TrustData } from "https://code4fukui.github.io/TrustData/TrustData.js";
// ユーザー作成 (DIDとシークレット)
const user = TrustData.createUser();
console.log(user.did); // 公開してOK！ DID = 分散型ID = 公開鍵
console.log(user.secret); // 秘密にしないといけない秘密鍵

// 電子署名付きの信頼できるデータを生成
const bin = TrustData.encode("test", user);

// 受け取り側で検証可能 (改竄があれば例外発生)
const res = TrustData.decode(bin);
console.log(res.body); // "test"
```

## 指定ユーザのみ複合できる、暗号化された信頼できるデータ連携

```js
import { TrustData } from "https://code4fukui.github.io/TrustData/TrustData.js";
const user1 = TrustData.createUser();
const user2 = TrustData.createUser();
const bin = TrustData.encode("test", user1, user2.did); // 相手のDIDで暗号化

// ユーザ2
const bin2 = TrustData.decode(bin, user2); // 自分の鍵で復号化
console.log(bin2.body); // "test"
```

## 任意のデータを入れることが可能

```js
const json = { abc: "ABC", num: 5858858, bin: new Uint8Array([1, 2, 3])};
const bin = TrustData.encode(json, user);
const res = TrustData.decode(bin);
console.log(res.body);
```

## 更新前データを含んだ電子署名による信頼できるデータ更新の実装例

```js
import { TrustData } from "https://code4fukui.github.io/TrustData/TrustData.js";
// ユーザ1による作成
const user1 = TrustData.createUser();
const bin1 = TrustData.encode("test1", user1);
// ユーザ2による更新
const user2 = TrustData.createUser();
const bin2 = TrustData.encode(["test2", bin1], user2);

// 検証
const res2 = TrustData.decode(bin2);
const res1 = TrustData.decode(res2.body[1]);
console.log(res1.body); // "test1"
```
