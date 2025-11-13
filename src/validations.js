
export const isValidZIP = (zip) => /^\d{5}$/.test(zip);


export const isValidPIN = (pin) => /^\d{6}$/.test(pin);



export const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);


export const isValidAadhaar = (aadhaar) => /^\d{12}$/.test(aadhaar);


export const isValidCardNumber = (num) => {
  const clean = num.replace(/\s+/g, "");
  return /^\d{16}$/.test(clean);
};


export const isValidExpiry = (exp) => {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) return false;
  const [month, year] = exp.split("/").map(Number);
  const now = new Date();
  const expiry = new Date(2000 + year, month);
  return expiry > now;
};


export const isValidCVV = (cvv) => /^\d{3}$/.test(cvv);



export function validateInputs({
  shippingType,
  sourceCountry,
  zipCode,
  destinationCountry,
  pinCode,
  chooseCourier,
}) {
  const e = {};

  if (shippingType === "select") e.shippingType = "Please select shipping type";
  if (sourceCountry === "select") e.sourceCountry = "Please select source country";
  if (!isValidZIP(zipCode)) e.zipCode = "Please enter a valid 5-digit ZIP code";
  if (destinationCountry === "select")
    e.destinationCountry = "Please select destination country";
  if (!isValidPIN(pinCode)) e.pinCode = "Please enter a valid 6-digit PIN code";
  if (chooseCourier === "select") e.chooseCourier = "Please select a courier";

  if (Object.keys(e).length) e.form = "Please fill all fields correctly";

  return { valid: Object.keys(e).length === 0, errors: e };
}


export function validateCheckout({ pickup, toAddr }) {
  const e = {};

 
  if (!pickup.name) e.pickupName = "Pickup name required";
  if (!isValidPhone(pickup.phone)) e.pickupPhone = "Enter valid 10-digit phone number";
  if (!pickup.address1) e.pickupAddr1 = "Pickup address required";
  if (!pickup.city) e.pickupCity = "Pickup city required";
  if (!pickup.state) e.pickupState = "Pickup state required";
  if (!isValidZIP(pickup.zip)) e.pickupZip = "Valid 5-digit ZIP required";


  if (!toAddr.name) e.toName = "Receiver name required";
  if (!isValidPhone(toAddr.phone)) e.toPhone = "Enter valid 10-digit phone number";
  if (!toAddr.address1) e.toAddr1 = "Receiver address required";
  if (!toAddr.city) e.toCity = "Receiver city required";
  if (!toAddr.state) e.toState = "Receiver state required";
  if (!isValidPIN(toAddr.pin)) e.toPin = "Valid 6-digit PIN required";
  if (!isValidAadhaar(toAddr.aadhaar))
    e.aadhaar = "Valid 12-digit Aadhaar number required";

  return { valid: Object.keys(e).length === 0, errors: e };
}


export function validatePayment({ cardNumber, name, expiry, cvv }) {
  const e = {};

  if (!isValidCardNumber(cardNumber)) e.cardNumber = "Invalid card number (16 digits)";
  if (!name.trim()) e.name = "Cardholder name is required";
  if (!isValidExpiry(expiry)) e.expiry = "Invalid or expired date (MM/YY)";
  if (!isValidCVV(cvv)) e.cvv = "Invalid CVV (3–4 digits)";

  return { valid: Object.keys(e).length === 0, errors: e };
}
