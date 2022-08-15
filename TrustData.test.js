import * as t from "https://deno.land/std/testing/asserts.ts";
import { TrustData } from "./TrustData.js";

Deno.test("simple flow", () => {
  const user = TrustData.createUser();
  const bin = TrustData.encode(user, "test");
  t.assertEquals(bin.length, 123);
  const res = TrustData.decode(bin);
  t.assertEquals(user.did, res.did);
  t.assertEquals(res.body, "test");
});
Deno.test("simple flow with error", () => {
  const user = TrustData.createUser();
  const bin = TrustData.encode(user, "test");
  t.assertEquals(bin.length, 123);
  bin[1 + 32 + 10] = 0;
  t.assertThrows(() => {
    TrustData.decode(bin);
  });
});
Deno.test("simple flow with 2 people", () => {
  const user1 = TrustData.createUser();
  const user2 = TrustData.createUser();
  const bin1 = TrustData.encode(user1, "test1");
  const bin2 = TrustData.encode(user2, "test2", bin1);
  t.assertEquals(bin1.length, 124);
  t.assertEquals(bin2.length, 250);
  const res2 = TrustData.decode(bin2);
  t.assertEquals(res2.did, user2.did);
  t.assertEquals(res2.body, "test2");
  const res1 = TrustData.decode(res2.pre);
  t.assertEquals(res1.did, user1.did);
  t.assertEquals(res1.body, "test1");
});
Deno.test("save user", () => {
  const user = TrustData.createUser();
  const bin = TrustData.encode(user, user.secret);
  t.assertEquals(bin.length, 153);
  const res = TrustData.decode(bin);
  const user2 = { did: res.did, secret: res.body };
  t.assertEquals(user, user2);
});
Deno.test("simple flow with JSON", () => {
  const json = { abc: "ABC", num: 5858858, bin: new Uint8Array([1, 2, 3])};
  const user = TrustData.createUser();
  const bin = TrustData.encode(user, json);
  t.assertEquals(bin.length, 145);
  const res = TrustData.decode(bin);
  t.assertEquals(user.did, res.did);
  t.assertEquals(res.body, json);
});
Deno.test("encrypt / decrypt", async () => {
  const body = "abc";
  const user1 = TrustData.createUser();
  const user2 = TrustData.createUser();
  const bin = TrustData.encode(user1, body);
  const crypt = await TrustData.encrypt(user1, user2.did, bin);
  const bin2 = await TrustData.decrypt(user2, user1.did, crypt);
  t.assertEquals(bin, bin2);
  const res = TrustData.decode(bin2);
  t.assertEquals(res.body, "abc");
});
