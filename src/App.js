<<<<<<< HEAD
import React, { useState } from "react";
import "./App.css";
import CheckoutForm from "./CheckoutForm";
import PaymentModal from "./PaymentModal";
import ShippingLabel from "./ShippingLabel";
import { validateInputs } from "./validations";
import StepNavigator from "./stepNavigator";
=======
import React, { useState } from 'react';
import './App.css';
>>>>>>> 4f0288bdc30fe2a661437b116f79a18201715a0e

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  
  const [shippingType, setShippingType] = useState("select");
  const [sourceCountry, setSourceCountry] = useState("select");
  const [zipCode, setZipCode] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("select");
  const [pinCode, setPinCode] = useState("");
  const [chooseCourier, setChooseCourier] = useState("select");

  const [errors, setErrors] = useState({});
  const [details, setDetails] = useState(null);

  
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

  //  reset function
  const resetAll = () => {
    setShippingType("select");
    setSourceCountry("select");
    setZipCode("");
    setDestinationCountry("select");
    setPinCode("");
    setChooseCourier("select");

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

    setCurrentStep(1);
  };

  
  const handleZipChange = (e) => {
    if (/^\d{0,5}$/.test(e.target.value)) setZipCode(e.target.value);
  };

  const handlePinChange = (e) => {
    if (/^\d{0,6}$/.test(e.target.value)) setPinCode(e.target.value);
  };

  
  const validate = () => {
    const { valid, errors: e } = validateInputs({
      shippingType,
      sourceCountry,
      zipCode,
      destinationCountry,
      pinCode,
      chooseCourier,
    });
    setErrors(e);
    return valid;
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const priceINR = chooseCourier === "fedex" ? 1200 : 1000;
    const days = chooseCourier === "fedex" ? 5 : 7;
    const priceUSD = priceINR / 84;

    setDetails({ inr: priceINR, usd: priceUSD, days });
    setCurrentStep(1.5);
  };

 
  const proceedToCheckout = () => {
    setCurrentStep(2);
  };

 
  const handleCheckoutNext = () => {
    setCurrentStep(3);
  };

  
  const handlePaymentNext = () => {
    const tracking = "PMB-" + Math.floor(100000000 + Math.random() * 900000000);
    const payment = "PMB-PMT-" + Math.floor(10000000 + Math.random() * 90000000);

    setTrackingNumber(tracking);
    setPaymentRef(payment);

    setCurrentStep(4);
  };

 
  const changeStep = (step) => {
    if (step < currentStep) setCurrentStep(step);
  };

  return (
    <>
<<<<<<< HEAD
      <header className="page-header">Parcel My Box</header>

      <StepNavigator currentStep={currentStep} onStepClick={changeStep} />

=======
      <header className='page-header'> Parcel My Box</header>
    
>>>>>>> 4f0288bdc30fe2a661437b116f79a18201715a0e
      <div className="doc">
        <hr style={{ margin: "24px 0" }} />

       
        {currentStep === 1 && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="dropdown">
              <label>Type of Shipping:</label>
              <select
                value={shippingType}
                onChange={(e) => setShippingType(e.target.value)}
              >
                <option value="select">Select</option>
                <option value="document">Document</option>
              </select>
              {errors.shippingType && <p className="error">{errors.shippingType}</p>}
            </div>

            <div className="source">
              <label>Select Source Country:</label>
              <select
                value={sourceCountry}
                onChange={(e) => setSourceCountry(e.target.value)}
              >
                <option value="select">Select</option>
                <option value="USA">USA</option>
              </select>
            </div>

            <div className="zipcode">
              <label>Zip Code:</label>
              <input
                value={zipCode}
                onChange={handleZipChange}
                placeholder="Enter 5-digit zip code"
                maxLength="5"
              />
            </div>

            <div className="destination">
              <label>Select Destination Country:</label>
              <select
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
              >
                <option value="select">Select</option>
                <option value="india">INDIA</option>
              </select>
            </div>

            <div className="pincode">
              <label>Pin Code:</label>
              <input
                value={pinCode}
                onChange={handlePinChange}
                placeholder="Enter 6-digit pin code"
                maxLength="6"
              />
            </div>

            <div className="courier">
              <label>Select Courier:</label>
              <select
                value={chooseCourier}
                onChange={(e) => setChooseCourier(e.target.value)}
              >
                <option value="select">Select</option>
                <option value="fedex">FedEx</option>
                <option value="ups">UPS</option>
              </select>
            </div>

            <button type="submit">Get estimate</button>
          </form>
        )}

       
        {currentStep === 1.5 && details && (
          <div className="estimate-summary">
            <h3>Shipment Estimate</h3>
            <p><strong>Courier:</strong> {chooseCourier.toUpperCase()}</p>
            <p><strong>From:</strong> {sourceCountry} – {zipCode}</p>
            <p><strong>To:</strong> India – {pinCode}</p>
            <p><strong>Delivery Days:</strong> {details.days} days</p>

            <h2>Price: ₹{details.inr} / ${details.usd.toFixed(2)}</h2>

            <button onClick={proceedToCheckout}>Confirm & Continue</button>
          </div>
        )}

       
        {currentStep === 2 && (
          <CheckoutForm
            pickup={pickup}
            setPickup={setPickup}
            toAddr={toAddr}
            setToAddr={setToAddr}
            onNext={handleCheckoutNext}
            price={details.inr}
            courier={chooseCourier}
          />
        )}

   
        {currentStep === 3 && (
          <PaymentModal
            amount={details?.inr}
            form={paymentForm}
            setForm={setPaymentForm}
            onBack={() => setCurrentStep(2)}
            onNext={handlePaymentNext}
          />
        )}

       
        {currentStep === 4 && (
          <ShippingLabel
            amount={details?.inr}
            courier={chooseCourier}
            pickup={pickup}
            toAddr={toAddr}
            trackingNumber={trackingNumber}
            paymentRef={paymentRef}
            onFinish={resetAll}
          />
        )}
      </div>
    </>
  );
}

export default App;
