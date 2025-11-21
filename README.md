DocShip – Developer README

DocShip is a simple full-stack workflow for sending documents from USA → India.
It includes price estimation, address auto-parsing, manual address entry, payment capture, and a final shipping label.
This document provides a clear technical overview for developers.

1. Project Overview

DocShip runs as a 4-step shipping flow:

Estimation – User enters ZIP/PIN + courier → backend returns price & delivery days

Address Collection – User pastes an address (auto-parsed) or enters data manually

Payment – User submits card details → backend stores payment & generates a payment reference

Shipping Label – Final label shows tracking number, payment reference, and shipment summary

LocalStorage saves all steps to allow refresh recovery.

2. Key Features (Developer Detail)
2.1 Shipment Estimation

Inputs:

ZIP (USA, 5 digits)

PIN (India, 6 digits)

Courier selection (FedEx / UPS)

Backend:

Validates ZIP & PIN

Returns:

Price in INR

Delivery days (5 days FedEx, 7 days UPS)

Frontend stores estimation data and advances to the next step.

2.2 Address Input + Auto Parser

DocShip supports both auto-extraction and manual input.

Auto Parsing

User pastes an entire multi-line or single-line address.

Parser extracts:

Name

Phone

Address line

City

State

ZIP/PIN

Aadhaar (if present)

Works for both:

U.S. pickup addresses

Indian destination addresses

All extracted values populate the form automatically.

Manual Entry

All fields remain editable

Users can override parser output or type from scratch

2.3 Payment Collection

Payment form collects:

Card Number

Name on Card

Expiry

CVV

Backend saves:

Tracking number (from shipment save)

Amount

Card data (prototype only)

Backend returns:

paymentRef (unique reference ID)

Frontend stores the reference and moves to the label step.

2.4 Shipping Label Generation

Final label displays:

Courier (FedEx/UPS)

Price in INR

Delivery days

Pickup Address

Destination Address

Tracking Number

Payment Reference

Clicking Finish:

Clears all app state

Removes localStorage (docshipData)

Returns to Step 1

3. Architecture
Frontend (React)

Functional components with hooks

LocalStorage mirrors full app state

Key files:

App.js

CheckoutForm.js

PaymentModal.js

ShippingLabel.js

stepNavigator.js

validations.js

addressParser.js

Backend (Node.js + Express)

JSON-based storage:

shipments.json

payments.json

Responsibilities:

Validate ZIP & PIN

Estimate price

Save shipment (generate tracking)

Save payment (generate reference)

4. API Reference
POST /api/estimate

Returns price + delivery days.

POST /api/save-shipment

Creates a shipment record, returns:

{ "tracking": "DS123456" }

POST /api/save-payment

Saves payment, returns:

{ "paymentRef": "PMT99881" }

5. State Persistence

All progress is saved in:

localStorage["docshipData"]


Including:

Current step

Pickup & destination data

Payment form

Estimate results

Tracking number

Payment reference

Refresh never loses progress.

6. Reset Logic

resetAll():

Clears all form values

Clears estimate, shipment, and payment data

Removes docshipData

Returns to Step 1

7. Folder Structure
docship/
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── CheckoutForm.js
│   │   ├── PaymentModal.js
│   │   ├── ShippingLabel.js
│   │   ├── stepNavigator.js
│   │   ├── validations.js
│   │   ├── addressParser.js
│   │   └── App.css
│   └── public/
│
└── backend/
    ├── server.js
    ├── shipments.json
    ├── payments.json
    └── utils/

8. Developer Notes

JSON DB can be replaced with MongoDB/PostgreSQL

Estimation is currently static and can be integrated with real courier APIs

Parser can be extended with regex/NLP

Parcel shipping can be added later
