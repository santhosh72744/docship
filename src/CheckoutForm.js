import React, { useState, useEffect } from "react";
import AddressParser from "./AddressParser";
import { validateCheckout } from "./validations";
import "./CheckoutForm.css";

export default function CheckoutForm({
  pickup,
  setPickup,
  toAddr,
  setToAddr,
  price,
  courier,
  onBack,
  onNext,   
}) {
  const [errors, setErrors] = useState({});

  const onChange = (obj, setObj, key) => (e) =>
    setObj({ ...obj, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { valid, errors: valErrors } = validateCheckout({ pickup, toAddr });
    setErrors(valErrors);
    if (!valid) return;

   
    onNext(pickup, toAddr);
  };

  return (
    <div className="checkout-container">
      <h3 className="form-title">Complete Shipment Details</h3>

     
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <AddressParser
          label="From Address"
          onParsed={(data) =>
            setPickup({
              ...pickup,
              name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
              phone: data.phoneNumber || "",
              address1: data.unmappedText || "",
              city: data.city || "",
              state: data.state || "",
              zip: data.pinCode || pickup.zip,
            })
          }
        />

        <AddressParser
          label="To Address"
          onParsed={(data) =>
            setToAddr({
              ...toAddr,
              name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
              phone: data.phoneNumber || "",
              address1: data.unmappedText || "",
              city: data.city || "",
              state: data.state || "",
              pin: data.pinCode || toAddr.pin,
            })
          }
        />
      </div>

    
      <form onSubmit={handleSubmit} noValidate className="grid-2">

        
        <fieldset>
          <legend>From Address</legend>

          <label>
            Name
            <input value={pickup.name} onChange={onChange(pickup, setPickup, "name")} />
          </label>
          {errors.pickupName && <p className="error">{errors.pickupName}</p>}

          <label>
            Phone
            <input value={pickup.phone} onChange={onChange(pickup, setPickup, "phone")} />
          </label>
          {errors.pickupPhone && <p className="error">{errors.pickupPhone}</p>}

          <label>
            Address
            <input value={pickup.address1} onChange={onChange(pickup, setPickup, "address1")} />
          </label>
          {errors.pickupAddr1 && <p className="error">{errors.pickupAddr1}</p>}

          <label>
            City
            <input value={pickup.city} onChange={onChange(pickup, setPickup, "city")} />
          </label>
          {errors.pickupCity && <p className="error">{errors.pickupCity}</p>}

          <label>
            State
            <input value={pickup.state} onChange={onChange(pickup, setPickup, "state")} />
          </label>
          {errors.pickupState && <p className="error">{errors.pickupState}</p>}

          <label>
            ZIP
            <input
              value={pickup.zip}
              onChange={onChange(pickup, setPickup, "zip")}
              maxLength="5"
            />
          </label>
          {errors.pickupZip && <p className="error">{errors.pickupZip}</p>}
        </fieldset>

      
        <fieldset>
          <legend>To Address</legend>

          <label>
            Name
            <input value={toAddr.name} onChange={onChange(toAddr, setToAddr, "name")} />
          </label>
          {errors.toName && <p className="error">{errors.toName}</p>}

          <label>
            Phone
            <input value={toAddr.phone} onChange={onChange(toAddr, setToAddr, "phone")} />
          </label>
          {errors.toPhone && <p className="error">{errors.toPhone}</p>}

          <label>
            Address
            <input value={toAddr.address1} onChange={onChange(toAddr, setToAddr, "address1")} />
          </label>
          {errors.toAddr1 && <p className="error">{errors.toAddr1}</p>}

          <label>
            City
            <input value={toAddr.city} onChange={onChange(toAddr, setToAddr, "city")} />
          </label>
          {errors.toCity && <p className="error">{errors.toCity}</p>}

          <label>
            State
            <input value={toAddr.state} onChange={onChange(toAddr, setToAddr, "state")} />
          </label>
          {errors.toState && <p className="error">{errors.toState}</p>}

          <label>
            PIN
            <input
              value={toAddr.pin}
              onChange={onChange(toAddr, setToAddr, "pin")}
              maxLength="6"
            />
          </label>
          {errors.toPin && <p className="error">{errors.toPin}</p>}

          <label>
            Aadhaar
            <input
              value={toAddr.aadhaar}
              onChange={onChange(toAddr, setToAddr, "aadhaar")}
              maxLength="12"
            />
          </label>
          {errors.aadhaar && <p className="error">{errors.aadhaar}</p>}
        </fieldset>

      
        <div className="actions">
          <button type="button" onClick={onBack}>Back</button>

          <button type="submit" className="sub">
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
