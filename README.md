DocShip – Developer README

DocShip is a simple full-stack workflow for sending documents from USA → India.
It includes price estimation, address auto-parsing, manual address entry, payment capture, and a final shipping label.
This document provides a clear technical overview for developers.

1. Project Overview

DocShip runs as a 4-step shipping flow:

Estimation – User enters ZIP/PIN + courier → backend returns price & delivery days

Address Collection – User pastes an address (auto-parsed) or enters data manually

Payment – User submits card details → backend stores payment & generates ref ID

Shipping Label – Final label shows tracking number, payment reference, and shipment summary

LocalStorage saves all steps to allow refresh recovery.

2. Key Features (Developer Detail)
2.1 Shipment Estimation

Inputs:

ZIP (USA, 5 digits)

PIN (India, 6 digits)

Courier selection (FedEx / UPS)

Backend validates ZIP & PIN.

Backend returns:

price in INR

Delivered days (5 days FedEx, 7 days UPS)

Frontend stores estimation data and moves to next step.

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

ZIP or PIN

Aadhaar (if included)

Works for:

U.S. pickup addresses

Indian destination addresses

All extracted values populate the form automatically.

Manual Entry

Users can still type everything manually.

Parsed values are always editable.

2.3 Payment Collection

Payment form collects:

Card Number

Cardholder Name

Expiry

CVV

Backend saves payment details together with:

Shipment tracking number

Payment amount

Backend returns:

paymentRef (unique payment reference ID)

Frontend stores reference + moves to the label step.

2.4 Shipping Label Generation

On the final step, DocShip displays:

Courier

Price (INR)

Delivery days

Pickup Address

Destination Address

Tracking Number (from shipment save)

Payment Reference (from payment save)

User clicks Finish, which:

Runs resetAll()

Clears all React state

Clears LocalStorage (docshipData)

Returns the app to Step 1

3. Architecture
Frontend (React)

Uses functional components + hooks

Lives entirely in frontend/src/

LocalStorage mirrors full app state for refresh recovery

Key components:

App.js – step controller + persistence + reset logic

CheckoutForm.js – pickup/delivery address + parser

PaymentModal.js – card entry

ShippingLabel.js – final shipment summary

stepNavigator.js – wizard steps UI

validations.js – input validations

Backend (Node.js + Express)

Lightweight JSON-based storage:

shipments.json

payments.json

Responsibilities:

ZIP + PIN validation

Price estimation

Shipment saving (generates tracking)

Payment saving (generates payment reference)

4. API Reference
POST /api/estimate

Returns shipping price + estimated days.

POST /api/save-shipment

Creates shipment entry and returns tracking.

POST /api/save-payment

Creates payment entry and returns paymentRef.

5. State Persistence

DocShip keeps all progress in:

localStorage["docshipData"]


Contents include:

Current step

Estimate details

Pickup address

Destination address

Payment form

Tracking number

Payment reference

This ensures the user never loses progress on refresh.

6. Reset Logic

The resetAll() function:

Clears shipping fields

Clears address and payment fields

Removes docshipData from LocalStorage

Resets step to 1

Used after completing a shipment or when the user manually restarts.

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

JSON database can be swapped for MongoDB or PostgreSQL easily

Estimation logic currently uses static delivery days – ready for real courier API integration

Address parser can be extended with more regex or AI-based parsing

Supports only document shipping now but structure supports parcels too
User accounts + shipment history

Email/SMS notifications
