import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "utf8");
const iv = Buffer.from(process.env.ENCRYPTION_IV, "utf8");

export const encryptContact = (contact) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  console.log("IV : ", iv);

  let encrypted = cipher.update(contact, "utf8", "hex");

  encrypted += cipher.final("hex");

  return encrypted;
};

export const decryptContact = (encryptedContact) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encryptedContact, "hex", "utf8");

  decrypted += decipher.final("utf8");

  return decrypted;
};

export const hashContact = (contact) => {
  return crypto.createHash("sha256").update(contact).digest("hex");
};
