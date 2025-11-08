import React, { useState } from 'react';
import './App.css';



function App() {
  const [shippingType, setShippingType] = useState('select');
  const [sourceCountry, setSourceCountry] = useState('select');
  const [zipCode, setZipCode] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('select');
  const [pinCode, setPinCode] = useState('');
  const [chooseCourier, setChooseCourier] = useState('select');

  const [errors, setErrors] = useState({});
  const [details, setDetails] = useState(null);
  const [confirmMsg, setConfirmMsg] = useState('');

  const handleZipChange = (e) => {
    const v = e.target.value;
    if (/^\d{0,5}$/.test(v)) setZipCode(v);
  };

  const handlePinChange = (e) => {
    const v = e.target.value;
    if (/^\d{0,6}$/.test(v)) setPinCode(v);
  };

  const formatINR = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
  const formatUSD = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const validate = () => {
    const e = {};
    if (shippingType === 'select') e.shippingType = 'Please select shipping type';
    if (sourceCountry === 'select') e.sourceCountry = 'Please select source country';
    if (!/^\d{5}$/.test(zipCode)) e.zipCode = 'Please enter a valid 5-digit ZIP code';
    if (destinationCountry === 'select') e.destinationCountry = 'Please select destination country';
    if (!/^\d{6}$/.test(pinCode)) e.pinCode = 'Please enter a valid 6-digit PIN code';
    if (chooseCourier === 'select') e.chooseCourier = 'Please select a courier';
    if (Object.keys(e).length) e.form = 'Please fill all fields correctly';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDetails(null);
    setConfirmMsg('');

    if (!validate()) return;

    let priceINR = 0;
  let days = 0;

  if (chooseCourier === 'fedex') {
    priceINR = 1200; // FedEx fixed price
    days = 5;        // FedEx delivery days
  } else if (chooseCourier === 'ups') {
    priceINR = 1000; // UPS fixed price
    days = 7;        // UPS delivery days
  }

  const USD_RATE = 84;
  const priceUSD = priceINR / USD_RATE;

    setDetails({ inr: priceINR, usd: priceUSD, days });
  };

  const handleConfirm = () => {
    if (!details) return;
    setConfirmMsg(
      ` Booking confirmed with ${chooseCourier.toUpperCase()} for ${shippingType}. 
       Price: ${formatINR(details.inr)} (${formatUSD(details.usd)}), ETA: ${details.days} days.`
    );
  };

  return (
    <>
      <header className='page-header'> Parcel My Box</header>


      <div className="doc">
        <form onSubmit={handleSubmit} noValidate>
          <div className="dropdown">
            <label>Type of Shipping: </label>
            <select value={shippingType} onChange={(e) => setShippingType(e.target.value)}>
              <option value="select">Select</option>
              <option value="document">Document</option>
            </select>
            {errors.shippingType && <p className="error">{errors.shippingType}</p>}
          </div>

          <div className="source">
            <label>Select Source Country: </label>
            <select value={sourceCountry} onChange={(e) => setSourceCountry(e.target.value)}>
              <option value="select">Select</option>
              <option value="USA">USA</option>
            </select>
            {errors.sourceCountry && <p className="error">{errors.sourceCountry}</p>}
          </div>

          <div className="zipcode">
            <label>Zip Code: </label>
            <input
              type="text"
              value={zipCode}
              onChange={handleZipChange}
              placeholder="Enter 5-digit zip code"
              maxLength="5"
            />
            {errors.zipCode && <p className="error">{errors.zipCode}</p>}
          </div>

          <div className="destination">
            <label>Select Destination Country: </label>
            <select
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
            >
              <option value="select">Select</option>
              <option value="india">INDIA</option>
            </select>
            {errors.destinationCountry && <p className="error">{errors.destinationCountry}</p>}
          </div>

          <div className="pincode">
            <label>Pin Code: </label>
            <input
              type="text"
              value={pinCode}
              onChange={handlePinChange}
              placeholder="Enter 6-digit pin code"
              maxLength="6"
            />
            {errors.pinCode && <p className="error">{errors.pinCode}</p>}
          </div>

          <div className="courier">
            <label>Select Courier: </label>
            <select value={chooseCourier} onChange={(e) => setChooseCourier(e.target.value)}>
              <option value="select">Select</option>
              <option value="fedex">FedEx</option>
              <option value="ups">UPS</option>
            </select>
            {errors.chooseCourier && <p className="error">{errors.chooseCourier}</p>}
          </div>

          {errors.form && <p className="error" style={{ fontWeight: 600 }}>{errors.form}</p>}

          <button type="submit">Submit</button>
        </form>

        {details && (
          <>
            <div className="details">
              <h3>Details:</h3>
              <p>Price (INR): <strong>{formatINR(details.inr)}</strong></p>
              <p>Price (USD): <strong>{formatUSD(details.usd)}</strong></p>
              <p>Estimated Days: <strong>{details.days} days</strong></p>
            </div>

            <button  onClick={handleConfirm} className="confirm-btn">
              Confirm
            </button>
          </>
        )}

        {confirmMsg && (
          <div className="details" role="status" aria-live="polite">
            {confirmMsg}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
