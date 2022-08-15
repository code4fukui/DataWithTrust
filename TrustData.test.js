import * as t from "https://deno.land/std/testing/asserts.ts";
import { TrustData } from "./TrustData.js";

Deno.test("simple flow", () => {
  const user = TrustData.createUser();
  const bin = TrustData.encode("test", user);
  t.assertEquals(bin.length, 122);
  const res = TrustData.decode(bin);
  t.assertEquals(user.did, res.did);
  t.assertEquals(res.payload, "test");
});
Deno.test("simple flow with error", () => {
  const user = TrustData.createUser();
  const bin = TrustData.encode("test", user);
  t.assertEquals(bin.length, 122);
  bin[1 + 32 + 10] = 0;
  t.assertThrows(() => {
    TrustData.decode(bin);
  });
});
Deno.test("simple flow with 2 people", () => {
  const user1 = TrustData.createUser();
  const user2 = TrustData.createUser();
  const bin1 = TrustData.encode(["test1", null], user1);
  const bin2 = TrustData.encode(["test2", bin1], user2);
  t.assertEquals(bin1.length, 125);
  t.assertEquals(bin2.length, 252);
  const res2 = TrustData.decode(bin2);
  t.assertEquals(res2.did, user2.did);
  t.assertEquals(res2.payload, ["test2", bin1]);
  const res1 = TrustData.decode(res2.payload[1]);
  t.assertEquals(res1.did, user1.did);
  t.assertEquals(res1.payload, ["test1", null]);
});
Deno.test("save user", () => {
  const user = TrustData.createUser();
  const bin = TrustData.encode(user.secret, user);
  t.assertEquals(bin.length, 152);
  const res = TrustData.decode(bin);
  const user2 = { did: res.did, secret: res.payload };
  t.assertEquals(user, user2);
});
Deno.test("simple flow with JSON", () => {
  const json = { abc: "ABC", num: 5858858, bin: new Uint8Array([1, 2, 3])};
  const user = TrustData.createUser();
  const bin = TrustData.encode(json, user);
  t.assertEquals(bin.length, 144);
  const res = TrustData.decode(bin);
  t.assertEquals(user.did, res.did);
  t.assertEquals(res.payload, json);
});
Deno.test("private (encrypt / decrypt)", () => {
  const payload = "abc";
  const user1 = TrustData.createUser();
  const user2 = TrustData.createUser();
  const bin = TrustData.encode(payload, user1, user2.did);
  t.assertEquals(bin.length, 150);
  const res = TrustData.decode(bin, user2);
  t.assertEquals(res.did, user1.did);
  t.assertEquals(res.payload, payload);
});
Deno.test("private error (encrypt / decrypt)", () => {
  const payload = "abc";
  const user1 = TrustData.createUser();
  const user2 = TrustData.createUser();
  const bin = TrustData.encode(payload, user1, user2.did);
  t.assertThrows(() => {
    TrustData.decode(bin); // not set user2
  });
});
