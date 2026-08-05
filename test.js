import "dotenv/config";
import { encryptContact, decryptContact, hashContact } from "./src/utils/crypto.js";

const contact = "9876543210";

const encrypted =
    encryptContact(contact);

console.log("Encrypted:");

console.log(encrypted);

console.log();

console.log("Decrypted:");

console.log(
    decryptContact(encrypted)
);

console.log();

console.log("Hash:");

console.log(
    hashContact(contact)
);