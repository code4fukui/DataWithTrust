# DataWithTrust - TrustData.js for DFFT

A simple JavaScript ES module for DataWithTrust / DFFT (Decentralized and Fair Data Flow Transaction).

## Features
- Reliable data transfer with digital signatures
- Data encryption for specific users
- Support for arbitrary data types (JSON, binary, etc.)
- Versioning with previous data included in updates

## Requirements
- [Ed25519](https://en.wikipedia.org/wiki/EdDSA), [X25519](https://en.wikipedia.org/wiki/Curve25519), and [AES-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) (recommended for TLS 1.3)

## Usage

### Reliable data transfer with digital signatures
```js
import { TrustData } from "https://code4fukui.github.io/DataWithTrust/TrustData.js";
// Create a user (DID and secret)
const user = TrustData.createUser();
console.log(user.did); // Public DID (Decentralized Identifier)
console.log(user.secret); // Secret key (keep it secret!)

// Generate data with a digital signature
const bin = TrustData.encode("test", user);

// Verify the signature on receipt (exception if tampered)
const res = TrustData.decode(bin);
console.log(res.payload); // "test"
```

### Encrypted data transfer for specific users
```js
import { TrustData } from "https://code4fukui.github.io/DataWithTrust/TrustData.js";
const user1 = TrustData.createUser();
const user2 = TrustData.createUser();
const bin = TrustData.encode("test", user1, user2.did); // Encrypt for user2

// User2
const bin2 = TrustData.decode(bin, user2); // Decrypt with own key
console.log(bin2.payload); // "test"
```

### Storing arbitrary data
```js
const json = { abc: "ABC", num: 123456, bin: new Uint8Array([1, 2, 3]) };
const bin = TrustData.encode(json, user);
const res = TrustData.decode(bin);
console.log(res.payload);
```

### Reliable data updates with previous data
```js
import { TrustData } from "https://code4fukui.github.io/DataWithTrust/TrustData.js";
// Created by user1
const user1 = TrustData.createUser();
const bin1 = TrustData.encode("test1", user1);
// Updated by user2
const user2 = TrustData.createUser();
const bin2 = TrustData.encode(["test2", bin1], user2);

// Verify
const res2 = TrustData.decode(bin2);
const res1 = TrustData.decode(res2.payload[1]);
console.log(res1.payload); // "test1"
```

## License
[MIT License](LICENSE)