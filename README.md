# TrustData

信頼できるデータ連携をしよう！ (with Ed25519, X25519)

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
