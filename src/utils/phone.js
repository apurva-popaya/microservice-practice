import { parsePhoneNumberFromString } from "libphonenumber-js";

export const validatePhoneNumber = (countryCode, contact) => {
  const errors = [];

  if (!countryCode || !/^\+\d{1,4}$/.test(countryCode)) {
    errors.push({
      field: "country_code",
      message: "Invalid country code",
    });
  }

  if (!contact || !/^\d{10}$/.test(contact)) {
    errors.push({
      field: "contact",
      message: "Invalid contact number",
    });
  }

  if (errors.length === 0) {
    const phone = parsePhoneNumberFromString(
      `${countryCode}${contact}`
    );

    if (!phone || !phone.isValid()) {
      errors.push({
        field: "contact",
        message: "Invalid Phone number",
      });
    }
    if (
      countryCode === "+91" &&
      !/^[7-9]\d{9}$/.test(contact)
    ) {
      errors.push({
        field: "contact",
        message:
          "Invalid Contact Number",
      });
    }
  }
  
  return errors;
};
