import React, { useState } from "react";
import { validatePayment } from "./validations";
import "./PaymentModal.css";

export default function PaymentModal({ amount, onBack, onNext, form, setForm }) {
  const [errors, setErrors] = useState({});
  const [paid, setPaid] = useState(false);

  // -----------------------------
  // INPUT HANDLERS
  // -----------------------------
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setForm({ ...form, cardNumber: value });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2, 4);
    setForm({ ...form, expiry: value.slice(0, 5) });
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setForm({ ...form, cvv: value });
  };

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  // -----------------------------
  // SUBMIT HANDLER (async)
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate card inputs
    const { valid, errors } = validatePayment(form);
    setErrors(errors);
    if (!valid) return;

    // Mark frontend as paid
    setPaid(true);

    // onNext() will save payment to backend (App.js)
  };

  return (
    <div className="payment-step">
      {!paid ? (
        <>
          <h2 className="step-title">Payment</h2>
          <p className="amount-info">Total Amount: ₹{amount}</p>

          <form onSubmit={handleSubmit} className="payment-form" noValidate>
            {/* CARD NUMBER */}
            <label>
              Card Number:
              <input
                placeholder="XXXX XXXX XXXX XXXX"
                value={form.cardNumber}
                onChange={handleCardNumberChange}
                maxLength="19"
              />
              {errors.cardNumber && <p className="error">{errors.cardNumber}</p>}
            </label>

            {/* NAME */}
            <label>
              Name on Card:
              <input
                placeholder="Name"
                value={form.name}
                onChange={handleChange("name")}
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </label>

            {/* EXPIRY */}
            <label>
              Expiry (MM/YY):
              <input
                placeholder="MM/YY"
                value={form.expiry}
                onChange={handleExpiryChange}
                maxLength="5"
              />
              {errors.expiry && <p className="error">{errors.expiry}</p>}
            </label>

            {/* CVV */}
            <label>
              CVV:
              <input
                type="password"
                placeholder="XXX"
                value={form.cvv}
                onChange={handleCVVChange}
                maxLength="3"
              />
              {errors.cvv && <p className="error">{errors.cvv}</p>}
            </label>

            <div className="actions">
              <button type="button" onClick={onBack}>
                Back
              </button>

              <button type="submit" className="sub">
                Pay Now
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 className="step-title">✅ Payment Successful</h2>
          <p>Your payment of ₹{amount} was received.</p>

          <div className="actions">
            <button className="sub" onClick={onNext}>
              Continue to Label
            </button>
          </div>
        </>
      )}
    </div>
  );
}
