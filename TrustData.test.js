import * as t from "https://deno.land/std/testing/asserts.ts";
import { TrustData } from "./TrustData.js";

Deno.test("simple flow", async () => {
  const user = await TrustData.createUser();
  const bin = await TrustData.encode("test", user);
  t.assertEquals(bin.length, 122);
  const res = await TrustData.decode(bin);
  t.assertEquals(user.did, res.did);
  t.assertEquals(res.body, "test");
});
Deno.test("simple flow with error", async () => {
  const user = await TrustData.createUser();
  const bin = await TrustData.encode("test", user);
  t.assertEquals(bin.length, 122);
  bin[1 + 32 + 10] = 0;
  await t.assertRejects(
    () => {
      return TrustData.decode(bin);
    },
    Error,
    "illegal signature",
  );
  /*
  t.assertThrows(async () => {
    await TrustData.decode(bin);
  });
  */
});
Deno.test("simple flow with 2 people", async () => {
  const user1 = await TrustData.createUser();
  const user2 = await TrustData.createUser();
  const bin1 = await TrustData.encode(["test1", null], user1);
  const bin2 = await TrustData.encode(["test2", bin1], user2);
  t.assertEquals(bin1.length, 125);
  t.assertEquals(bin2.length, 252);
  const res2 = await TrustData.decode(bin2);
  t.assertEquals(res2.did, user2.did);
  t.assertEquals(res2.body, ["test2", bin1]);
  const res1 = await TrustData.decode(res2.body[1]);
  t.assertEquals(res1.did, user1.did);
  t.assertEquals(res1.body, ["test1", null]);
});
Deno.test("save user", async () => {
  const user = await TrustData.createUser();
  const bin = await TrustData.encode(user.secret, user);
  t.assertEquals(bin.length, 152);
  const res = await TrustData.decode(bin);
  const user2 = { did: res.did, secret: res.body };
  t.assertEquals(user, user2);
});
Deno.test("simple flow with JSON", async () => {
  const json = { abc: "ABC", num: 5858858, bin: new Uint8Array([1, 2, 3])};
  const user = await TrustData.createUser();
  const bin = await TrustData.encode(json, user);
  t.assertEquals(bin.length, 144);
  const res = await TrustData.decode(bin);
  t.assertEquals(user.did, res.did);
  t.assertEquals(res.body, json);
});
Deno.test("private (encrypt / decrypt)", async () => {
  const body = "abc";
  const user1 = await TrustData.createUser();
  const user2 = await TrustData.createUser();
  const bin = await TrustData.encode(body, user1, user2.did);
  t.assertEquals(bin.length, 150);
  const res = await TrustData.decode(bin, user2);
  t.assertEquals(res.did, user1.did);
  t.assertEquals(res.body, body);
});
Deno.test("private error (encrypt / decrypt)", async () => {
  const body = "abc";
  const user1 = await TrustData.createUser();
  const user2 = await TrustData.createUser();
  const bin = await TrustData.encode(body, user1, user2.did);
  await t.assertRejects(
    () => {
      return TrustData.decode(bin); // not set user2
    },
    Error,
    "illegal signature",
  );
});
