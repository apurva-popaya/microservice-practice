import { parsePhoneNumberFromString } from "libphonenumber-js";

export const normalizePhoneNumber = (contact) => {
  const phone = parsePhoneNumberFromString(contact, "IN");
  return phone ? phone.number : contact;
};

export const validatePhoneNumber = (contact) => {
  const phone = parsePhoneNumberFromString(contact, "IN");
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
                    "Indian mobile numbers must start with 7, 8 or 9",
            },
        ];
    }
  return [];
};
