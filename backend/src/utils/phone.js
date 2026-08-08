import { parsePhoneNumberFromString } from "libphonenumber-js";

export const normalizePhoneNumber = (contact) => {
  if (!contact) {
    return contact;
  }
  const phone = contact.startsWith("+")
    ? parsePhoneNumberFromString(contact)
    : parsePhoneNumberFromString(contact, "IN");

  return phone ? phone.number : contact;
};

export const validatePhoneNumber = (contact) => {
  const phone = contact.startsWith("+")
    ? parsePhoneNumberFromString(contact)
    : parsePhoneNumberFromString(contact, "IN");

  if (!phone || !phone.isValid()) {
    return [
      {
        field: "contact",
        message: "Invalid contact number",
      },
    ];
  }
  if (
    phone.country === "IN" &&
    !/^[7-9]\d{9}$/.test(phone.nationalNumber)
  ) {
    return [
      {
        field: "contact",
        message:
          "Invalid Number",
      },
    ];
  }

  return [];
};
