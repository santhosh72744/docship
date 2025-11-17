import React, { useState, useEffect } from "react";
import "./App.css";
import CheckoutForm from "./CheckoutForm";
import PaymentModal from "./PaymentModal";
import ShippingLabel from "./ShippingLabel";
import StepNavigator from "./stepNavigator";
import { validateInputs } from "./validations";

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  const [shippingType, setShippingType] = useState("document");
  const [sourceCountry, setSourceCountry] = useState("USA");
  const [zipCode, setZipCode] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("india");
  const [pinCode, setPinCode] = useState("");
  const [chooseCourier, setChooseCourier] = useState("");

  const [errors, setErrors] = useState({});
  const [details, setDetails] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [pickup, setPickup] = useState({
    name: "",
    phone: "",
    address1: "",
    city: "",
    state: "",
    zip: "",
  });

  const [toAddr, setToAddr] = useState({
    name: "",
    phone: "",
    address1: "",
    city: "",
    state: "",
    pin: "",
    aadhaar: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [trackingNumber, setTrackingNumber] = useState("");
  const [paymentRef, setPaymentRef] = useState("");

  // ======================================================
  // LOAD SAVED DATA
  // ======================================================
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("docshipData"));
      if (!saved) return;

      setCurrentStep(saved.currentStep || 1);
      setShippingType(saved.shippingType || "document");
      setSourceCountry(saved.sourceCountry || "USA");
      setZipCode(saved.zipCode || "");
      setDestinationCountry(saved.destinationCountry || "india");
      setPinCode(saved.pinCode || "");
      setChooseCourier(saved.chooseCourier || "");

      if (saved.pickup) setPickup(saved.pickup);
      if (saved.toAddr) setToAddr(saved.toAddr);
      if (saved.paymentForm) setPaymentForm(saved.paymentForm);
      if (saved.details) setDetails(saved.details);
      if (saved.trackingNumber) setTrackingNumber(saved.trackingNumber);
      if (saved.paymentRef) setPaymentRef(saved.paymentRef);
    } catch {}
  }, []);

  // ======================================================
  // SAVE TO LOCAL STORAGE
  // ======================================================
  useEffect(() => {
    const payload = {
      currentStep,
      shippingType,
      sourceCountry,
      zipCode,
      destinationCountry,
      pinCode,
      chooseCourier,
      pickup,
      toAddr,
      paymentForm,
      details,
      trackingNumber,
      paymentRef,
    };

    localStorage.setItem("docshipData", JSON.stringify(payload));
  }, [
    currentStep,
    shippingType,
    sourceCountry,
    zipCode,
    destinationCountry,
    pinCode,
    chooseCourier,
    pickup,
    toAddr,
    paymentForm,
    details,
    trackingNumber,
    paymentRef,
  ]);

  // ======================================================
  // RESET EVERYTHING
  // ======================================================
  const resetAll = () => {
    setShippingType("document");
    setSourceCountry("USA");
    setZipCode("");
    setDestinationCountry("india");
    setPinCode("");
    setChooseCourier("");

    setErrors({});
    setDetails(null);

    setPickup({
      name: "",
      phone: "",
      address1: "",
      city: "",
      state: "",
      zip: "",
    });

    setToAddr({
      name: "",
      phone: "",
      address1: "",
      city: "",
      state: "",
      pin: "",
      aadhaar: "",
    });

    setPaymentForm({
      cardNumber: "",
      name: "",
      expiry: "",
      cvv: "",
    });

    setTrackingNumber("");
    setPaymentRef("");

    localStorage.removeItem("docshipData");
    setCurrentStep(1);
  };

  // ======================================================
  // VALIDATE STEP 1
  // ======================================================
  const validate = async () => {
    const { valid, errors: e } = await validateInputs({
      shippingType,
      sourceCountry,
      zipCode,
      destinationCountry,
      pinCode,
      chooseCourier,
    });

    setErrors(e || {});
    return valid;
  };

  // ======================================================
  // GET ESTIMATE
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validate())) return;

    const res = await fetch("http://localhost:5000/api/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zip: zipCode,
        pin: pinCode,
        courier: chooseCourier === "fedex" ? "FedEx" : "UPS",
      }),
    });

    const data = await res.json();
    const priceINR = data.price;
    const days = chooseCourier === "fedex" ? 5 : 7;

    setDetails({
      inr: priceINR,
      usd: priceINR / 84,
      days,
    });

    // save shipment
    const saveRes = await fetch("http://localhost:5000/api/save-shipment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pickup,
        toAddr,
        courier: chooseCourier,
        amount: priceINR,
        days,
      }),
    });

    const saveData = await saveRes.json();
    setTrackingNumber(saveData.tracking);
  };

  // ======================================================
  // PAYMENT NEXT
  // ======================================================
  const handlePaymentNext = async () => {
    const res = await fetch("http://localhost:5000/api/save-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardNumber: paymentForm.cardNumber,
        name: paymentForm.name,
        expiry: paymentForm.expiry,
        amount: details.inr,
        trackingNumber,
      }),
    });

    const data = await res.json();
    setPaymentRef(data.paymentRef);
    setCurrentStep(4);
  };

  // ======================================================
  // Supported PIN list (Modal)
  // ======================================================
  const supportedPins = [
    { city: "New Delhi", range: "110001 – 110097" },
    { city: "Mumbai", range: "400001 – 400014" },
    { city: "Navi Mumbai", range: "400601 – 400708" },
    { city: "Bengaluru", range: "560001 – 560105" },
    { city: "Chennai", range: "600001 – 600127" },
    { city: "Kolkata", range: "700001 – 700156" },
    { city: "Hyderabad", range: "500001 – 500096" },
    { city: "Ahmedabad", range: "380001 – 382481" },
    { city: "Pune", range: "411001 – 411062" },
    { city: "Surat", range: "394000 – 395999" },
    { city: "Jaipur", range: "302001 – 302039" },
    { city: "Visakhapatnam", range: "530001" },
  ];

  // ======================================================
  // UI
  // ======================================================
  return (
    <>
      <header className="page-header">Parcel My Box</header>
      <StepNavigator currentStep={currentStep} onStepClick={setCurrentStep} />

      {/* ⭐ Supported PIN Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h2>Supported PIN Codes</h2>

            <ul className="pin-list">
              {supportedPins.map((item) => (
                <li key={item.city}>
                  <strong>{item.city}:</strong> {item.range}
                </li>
              ))}
            </ul>

            <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <div className="doc">
        <hr style={{ margin: "20px 0" }} />

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="estimate-container">

            {/* RESET */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
              <button
                type="button"
                onClick={resetAll}
                style={{
                  background: "#584fd9",
                  color: "white",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Reset
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="estimate-left" noValidate>
              <h2 className="section-title">1. Get Shipment Estimate</h2>

              <div className="form-grid">
                <div>
                  <label>Type of Shipping:</label>
                  <select value={shippingType} onChange={(e) => setShippingType(e.target.value)}>
                    <option value="document">Document</option>
                  </select>
                </div>

                <div>
                  <label>Source Country:</label>
                  <select value={sourceCountry} onChange={(e) => setSourceCountry(e.target.value)}>
                    <option value="USA">USA</option>
                  </select>
                </div>

                <div>
                  <label>Zip Code:</label>
                  <input
                    value={zipCode}
                    onChange={(e) => /^\d{0,5}$/.test(e.target.value) && setZipCode(e.target.value)}
                    placeholder="5-digit ZIP"
                  />
                  {errors.zipCode && <p className="error">{errors.zipCode}</p>}
                </div>

                <div>
                  <label>Destination Country:</label>
                  <select value={destinationCountry} onChange={(e) => setDestinationCountry(e.target.value)}>
                    <option value="india">India</option>
                  </select>
                </div>

                <div>
                  <label>
                    Pin Code:
                    <span
                      onClick={() => setModalOpen(true)}
                      style={{
                        marginLeft: "10px",
                        color: "#584fd9",
                        cursor: "pointer",
                        fontSize: "13px",
                        textDecoration: "underline",
                      }}
                    >
                      Supported PIN codes
                    </span>
                  </label>

                  <input
                    value={pinCode}
                    onChange={(e) => /^\d{0,6}$/.test(e.target.value) && setPinCode(e.target.value)}
                    placeholder="6-digit PIN"
                  />
                  {errors.pinCode && <p className="error">{errors.pinCode}</p>}
                </div>
              </div>

              {/* COURIER SELECT */}
              <div className="courier-row">
                <button
                  type="button"
                  onClick={() => setChooseCourier("fedex")}
                  className={chooseCourier === "fedex" ? "active" : ""}
                >
                  FedEx
                </button>

                <button
                  type="button"
                  onClick={() => setChooseCourier("ups")}
                  className={chooseCourier === "ups" ? "active" : ""}
                >
                  UPS
                </button>
              </div>

              <button type="submit" className="get-est-btn">
                Get Estimate
              </button>
            </form>

            {/* ESTIMATE BOX */}
            {details && (
              <div className="estimate-right">
                <h3>Shipment Estimation</h3>

                <p><strong>Courier:</strong> {chooseCourier.toUpperCase()}</p>
                <p><strong>Route:</strong> USA ({zipCode}) → India ({pinCode})</p>
                <p><strong>Delivery:</strong> {details.days} days</p>

                <div className="price-box">
                  ₹{details.inr}
                  <br />
                  <span className="usd">(${details.usd.toFixed(2)} USD)</span>
                </div>

                <button className="confirm-btn" onClick={() => setCurrentStep(2)}>
                  Confirm & Continue (Step 2)
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <CheckoutForm
            pickup={pickup}
            setPickup={setPickup}
            toAddr={toAddr}
            setToAddr={setToAddr}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <PaymentModal
            amount={details?.inr}
            form={paymentForm}
            setForm={setPaymentForm}
            onBack={() => setCurrentStep(2)}
            onNext={handlePaymentNext}
          />
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <ShippingLabel
            amount={details.inr}
            courier={chooseCourier}
            pickup={pickup}
            toAddr={toAddr}
            details={{ trackingNumber, paymentRef }}
            onFinish={resetAll}
          />
        )}
      </div>
    </>
  );
}

export default App;
