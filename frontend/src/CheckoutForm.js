import React, { useState } from "react";
import { validateCheckout } from "./validations";
import "./CheckoutForm.css";

/* -----------------------------------
   INLINE ADDRESS PARSER (COMBINED)
----------------------------------- */

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry"
];

const normalize = (s) => s.replace(/\s+/g, " ").trim();
const extractPIN = (t) => (t.match(/\b\d{6}\b/g) || []).pop() || "";
const extractPhone = (t) => {
  const re = /(?:\+91[\s-]*)?0?([6-9]\d{9})\b/g;
  let m, last = "";
  while ((m = re.exec(t))) last = m[1];
  return last || "";
};
const extractState = (t) =>
  STATES.find((st) => new RegExp(`\\b${st.replace(/\s/g, "\\s+")}\\b`, "i").test(t)) || "";

const extractCity = (t) => {
  const m = t.match(/\bcity\s*[:\-]\s*([A-Za-z.\s'-]{1,40})\b/i);
  return m ? normalize(m[1]) : "";
};

const guessName = (t) => {
  const lines = t.split(/\n|,/).map(normalize).filter(Boolean);
  const avoid = /^(address|flat|house|no|street|road|area|block|sector|lane|near|landmark|city|phone)/i;

  for (const line of lines) {
    if (!/\d{3,}/.test(line) && !avoid.test(line)) {
      return line;
    }
  }
  return "";
};

const removeSegments = (t, segs) => {
  let out = t;
  segs.filter(Boolean).forEach((s) => {
    const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(esc, "ig"), " ");
  });
  return normalize(out.replace(/[\s,.:;-]+/g, " "));
};

function parseIndianAddress(raw) {
  const text = String(raw || "").trim();

  const phoneNumber = extractPhone(text);
  const pinCode = extractPIN(text);
  const state = extractState(text);
  const city = extractCity(text);
  const fullName = guessName(text);

  let unmapped = removeSegments(text, [phoneNumber, pinCode, state, city, fullName]);
  unmapped = unmapped.replace(/^[,.\s-]+|[,.\s-]+$/g, "");

  return {
    firstName: fullName.split(" ")[0] || "",
    lastName: fullName.split(" ")[1] || "",
    phoneNumber,
    pinCode,
    state,
    city,
    unmappedText: unmapped,
  };
}

/* -----------------------------------
         MAIN CHECKOUT FORM
----------------------------------- */

export default function CheckoutForm({
  pickup,
  setPickup,
  toAddr,
  setToAddr,
  onNext,
}) {
  const [errors, setErrors] = useState({});

  const handleParseFrom = (data) => {
    setPickup({
      ...pickup,
      name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
      phone: data.phoneNumber || "",
      address1: data.unmappedText || "",
      city: data.city || "",
      state: data.state || "",
      zip: data.pinCode || pickup.zip,
    });
  };

  const handleParseTo = (data) => {
    setToAddr({
      ...toAddr,
      name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
      phone: data.phoneNumber || "",
      address1: data.unmappedText || "",
      city: data.city || "",
      state: data.state || "",
      pin: data.pinCode || toAddr.pin,
    });
  };

  const onChange = (obj, setObj, key) => (e) =>
    setObj({ ...obj, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { valid, errors: valErrors } = await validateCheckout({ pickup, toAddr });
    setErrors(valErrors);

    if (valid) onNext();
  };

  return (
    <div className="checkout-container">

      <h2 className="title">Complete Shipment Details</h2>

      {/* ----------- TOP PARSER BOXES ----------- */}
      <div className="parser-row">
        <div className="parser-box">
          <h3>From Address</h3>
          <textarea
            className="parser-input"
            placeholder="Paste address here"
            onChange={(e) => handleParseFrom(parseIndianAddress(e.target.value))}
          />
        </div>

        <div className="parser-box">
          <h3>To Address</h3>
          <textarea
            className="parser-input"
            placeholder="Paste address here"
            onChange={(e) => handleParseTo(parseIndianAddress(e.target.value))}
          />
        </div>
      </div>

      {/* ----------- FORM SIDE BY SIDE ----------- */}
      <form className="form-grid" onSubmit={handleSubmit}>

        {/* ----------------- FROM BLOCK ----------------- */}
        <fieldset>
          <legend>From Address</legend>

          <label>Name</label>
          <input value={pickup.name} onChange={onChange(pickup, setPickup, "name")} />
          {errors.pickupName && <p className="error">{errors.pickupName}</p>}

          <label>Phone</label>
          <input value={pickup.phone} onChange={onChange(pickup, setPickup, "phone")} />
          {errors.pickupPhone && <p className="error">{errors.pickupPhone}</p>}

          <label>Address</label>
          <input value={pickup.address1} onChange={onChange(pickup, setPickup, "address1")} />

          <label>City</label>
          <input value={pickup.city} onChange={onChange(pickup, setPickup, "city")} />

          <label>State</label>
          <input value={pickup.state} onChange={onChange(pickup, setPickup, "state")} />

          <label>ZIP</label>
          <input value={pickup.zip} maxLength="5" onChange={onChange(pickup, setPickup, "zip")} />
        </fieldset>

        {/* ----------------- TO BLOCK ----------------- */}
        <fieldset>
          <legend>To Address</legend>

          <label>Name</label>
          <input value={toAddr.name} onChange={onChange(toAddr, setToAddr, "name")} />

          <label>Phone</label>
          <input value={toAddr.phone} onChange={onChange(toAddr, setToAddr, "phone")} />

          <label>Address</label>
          <input value={toAddr.address1} onChange={onChange(toAddr, setToAddr, "address1")} />

          <label>City</label>
          <input value={toAddr.city} onChange={onChange(toAddr, setToAddr, "city")} />

          <label>State</label>
          <input value={toAddr.state} onChange={onChange(toAddr, setToAddr, "state")} />

          <label>PIN</label>
          <input value={toAddr.pin} maxLength="6" onChange={onChange(toAddr, setToAddr, "pin")} />

          <label>Aadhaar</label>
          <input value={toAddr.aadhaar} maxLength="12" onChange={onChange(toAddr, setToAddr, "aadhaar")} />
        </fieldset>

        {/* ----------- BUTTON ----------- */}
        <div className="btn-row">
          <button className="submit-btn">Continue to Payment</button>
        </div>
      </form>
    </div>
  );
}
