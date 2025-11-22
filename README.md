
flowchart TD

A([Start DocShip]) --> B[Enter ZIP (5 digits)]
B --> C[Enter PIN (6 digits)]
C --> D[Select Courier\n(FedEx / UPS)]
D --> E[Get Shipping Estimate\nPrice + Delivery Time]

E --> F[Paste Full Address]
F --> G[Address Parser API\n→ Structured Fields]

G --> H[Review Shipment Details]
H --> I[Enter Payment Details\n(Card No, Exp, CVV)]

I --> J[Payment Validation API]
J -->|Valid| K[Payment Success]
J -->|Invalid| JErr[Show Error\nInvalid Card Details]

K --> L[Create Shipment Record\n(shipments.json)]
L --> M[Generate Shipping Label\nPDF + Barcode + Tracking ID]

M --> N[Download Label (PDF)]
N --> O([Shipment Confirmed 🎉])
