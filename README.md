# TrustData

信頼できるデータ連携をしよう！ (with [Ed25519](https://ja.wikipedia.org/wiki/%E3%82%A8%E3%83%89%E3%83%AF%E3%83%BC%E3%82%BA%E6%9B%B2%E7%B7%9A%E3%83%87%E3%82%B8%E3%82%BF%E3%83%AB%E7%BD%B2%E5%90%8D%E3%82%A2%E3%83%AB%E3%82%B4%E3%83%AA%E3%82%BA%E3%83%A0), [X25519](https://ja.wikipedia.org/wiki/Curve25519) *TLS1.3推奨技術)

## 電子署名による信頼できるデータ連携

```js
// ユーザー作成 (DIDとシークレット)
const user = TrustData.makeUser();

// 電子署名付きバイナリを生成
const bin = TrustData.encode(user, "test");

// 受け取り側で検証可能
const res = TrustData.decode(bin);
```

## 前回データを含んだ電子署名による信頼できるデータ更新

```js
// ユーザ1による作成
const bin1 = TrustData.encode(user1, "test1");
// ユーザ2による更新
const bin2 = TrustData.encode(user2, "test2", bin1);

// 検証
const res2 = TrustData.decode(bin2);
const res1 = TrustData.decode(res2.pre);
```

## 任意のデータを入れることが可能

```js
const json = { abc: "ABC", num: 5858858, bin: new Uint8Array([1, 2, 3])};
const bin = TrustData.encode(user, json);
const res = TrustData.decode(bin);
console.log(res.body);
```

## 指定したユーザのみ複合できる暗号

```js
const bin = TrustData.encode(user1, body);
const crypt = await TrustData.encrypt(user1, user2.did, bin); // 相手のDIDで暗号化

// ユーザ2
const bin2 = await TrustData.decrypt(user2, user1.did, crypt); // 送信元のDIDで復号化
const body2 = TrustData.decode(bin2);
console.log(body2); // same as body!
```
