import React, { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import JsBarcode from "jsbarcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ShippingLabel.css";


export default function ShippingLabel({
  courier,
  amount,
  pickup,
  toAddr,
  details,
  onFinish,
}) {
  const barcodeRef = useRef(null);
  const labelRef = useRef(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const trackingNumber = details?.trackingNumber || "PMB-000000000";
  const paymentRef = details?.paymentRef || "PMB-PMT-00000000";


  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, trackingNumber.replace("PMB-", ""), {
        format: "CODE128",
        width: 2,
        height: 55,
        displayValue: false,
      });
    }
  }, [trackingNumber]);


  const handleDownload = async () => {
    const canvas = await html2canvas(labelRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${trackingNumber}_Label.pdf`);
  };

  const today = new Date();
  const shipDate = today
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    })
    .toUpperCase();

   

  return (
    <div className="label-wrapper">
     
      <div className="label-container" ref={labelRef}>
        
      
        <div className="row header">
          <div className="left">
            <p>ORIGIN ID: 1259372816</p>
            <p className="bold">SENDER NAME: {pickup?.name || "—"}</p>
            <p>{pickup?.address1 || "—"}</p>
            <p>
              {pickup?.city}, {pickup?.state} {pickup?.zip}
            </p>
            <p>Sender Contact: {pickup?.phone || "—"}</p>
          </div>

          <div className="right">
            <p>SHIP DATE: {shipDate}</p>
            <p>TOTAL WT: 0.5 KGS</p>
            <p>CURR: USD</p>
            <p>BILL SENDER</p>
          </div>
        </div>

     
        <div className="to-block">
          <p className="small">TO:</p>
          <p className="bold big">{toAddr?.name || "—"}</p>
          <p>{toAddr?.address1 || "—"}</p>
          <p>
            {toAddr?.city}, {toAddr?.state} {toAddr?.pin}
          </p>
          <p>Phone: {toAddr?.phone || "—"}</p>

         
          <p className="ref">PAYMENT REF: {paymentRef}</p>

       
          <p className="ref">REF: {trackingNumber}</p>
        </div>

       
        <div className="barcode-row">
          <svg ref={barcodeRef}></svg>

          <div className="courier-box">
            <div className="courier-name">{courier?.toUpperCase()}</div>
            <div className="service-code">E</div>
          </div>
        </div>

   
        <div className="qr">
          <QRCode value={trackingNumber} size={75} />
        </div>

      
        <div className="tracking-big">
          <p className="trk">TRK#</p>
          <p className="big-num">{trackingNumber.replace("PMB-", "")}</p>
          <p className="big-code">XQ HYDBG</p>
        </div>

      
        <div className="side-info">
          <p>AA</p>
          <p>IP EOD</p>
          <p>ETD RES</p>
          <p className="bold zip">{toAddr?.pin}</p>
          <p>TS-IN</p>
        </div>

       
        <div className="amount-area">
          <p>Amount Paid</p>
          <p className="amt">₹{amount}</p>
        </div>
      </div>

     
      <div className="bottom-buttons">
        <button className="download" onClick={handleDownload}>
          Download Label
        </button>
       <button
  className="done"
  onClick={() => setShowSuccess(true)}
>
  Done
</button>
</div>
     
{showSuccess && (
  <div className="success-box">
    <h2>✅ Shipment Successful!</h2>
    <p>Your shipment has been booked successfully.</p>

    <div className="success-actions">
      <button className="close-btn" onClick={onFinish}>
        Close
      </button>

      <button className="new-btn" onClick={onFinish}>
        Start New Shipment
      </button>
    </div>
  </div>
)}
    </div>
  );
}
